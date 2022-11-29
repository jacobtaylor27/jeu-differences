import { Bmp } from '@app/classes/bmp/bmp';
import { BMP_EXTENSION, DB_GAME_COLLECTION, DEFAULT_BMP_ASSET_PATH, ID_PREFIX } from '@app/constants/database';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpEncoderService } from '@app/services/bmp-encoder-service/bmp-encoder.service';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { DatabaseService } from '@app/services/database-service/database.service';
import { PrivateGameInformation } from '@app/interface/game-info';
import { Collection } from 'mongodb';
import { Service } from 'typedi';
import { v4 } from 'uuid';
import { GameCarousel } from '@app/interface/game-carousel';
// eslint-disable-next-line @typescript-eslint/no-require-imports -- can't import this otherwise
import LZString = require('lz-string');
import { Score } from '@common/score';

const NB_TO_RETRIEVE = 4;

@Service()
export class GameInfoService {
    private srcPath: string = DEFAULT_BMP_ASSET_PATH;

    // eslint-disable-next-line max-params -- absolutely need all the imported services
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly bmpService: BmpService,
        private readonly bmpSubtractorService: BmpSubtractorService,
        private readonly bmpDifferenceInterpreter: BmpDifferenceInterpreter,
        private readonly bmpEncoderService: BmpEncoderService,
    ) {}

    get collection(): Collection<PrivateGameInformation> {
        return this.databaseService.database.collection(DB_GAME_COLLECTION);
    }

    async getGamesInfo(pageNb: number): Promise<GameCarousel> {
        const nbOfGames = await this.collection.countDocuments();
        const nbOfPages = Math.ceil(nbOfGames / NB_TO_RETRIEVE);
        const currentPage = this.validatePageNumber(pageNb, nbOfPages);

        // skip pages to only retrieve the one we want
        const games = await this.collection.find({}, { skip: (currentPage - 1) * NB_TO_RETRIEVE, limit: NB_TO_RETRIEVE }).toArray();

        return {
            games,
            information: {
                currentPage,
                gamesOnPage: games.length,
                nbOfGames,
                nbOfPages,
                hasNext: currentPage < nbOfPages,
                hasPrevious: currentPage > 1,
            },
        };
    }

    validatePageNumber(pageNb: number, total: number): number {
        return pageNb < 1 ? 1 : pageNb > total ? 1 : pageNb;
    }

    async getAllGameInfos(): Promise<PrivateGameInformation[]> {
        return await this.collection.find({}).toArray();
    }

    async getGameInfoById(gameId: string): Promise<PrivateGameInformation> {
        const filter = { id: gameId };
        return (await this.collection.find(filter).toArray())[0];
    }

    async addGameInfoWrapper(images: { original: Bmp; modify: Bmp }, name: string, radius: number): Promise<void> {
        const idOriginalBmp = await this.bmpService.addBmp(await images.original.toImageData(), DEFAULT_BMP_ASSET_PATH);
        const idEditedBmp = await this.bmpService.addBmp(await images.modify.toImageData(), DEFAULT_BMP_ASSET_PATH);
        const differences = await this.bmpDifferenceInterpreter.getCoordinates(
            await this.bmpSubtractorService.getDifferenceBMP(images.original, images.modify, radius),
        );
        const difference = await this.bmpSubtractorService.getDifferenceBMP(images.original, images.modify, radius);
        const idDifferenceBmp = await this.bmpService.addBmp(await difference.toImageData(), DEFAULT_BMP_ASSET_PATH);
        const compressedThumbnail = LZString.compressToUTF16(
            await this.bmpEncoderService.base64Encode(this.srcPath + '/' + ID_PREFIX + idOriginalBmp + BMP_EXTENSION),
        );

        await this.addGameInfo({
            id: v4(),
            name,
            idOriginalBmp,
            idEditedBmp,
            thumbnail: compressedThumbnail,
            differenceRadius: radius,
            differences,
            idDifferenceBmp,
            soloScore: [],
            multiplayerScore: [],
        });
    }

    async addGameInfo(game: PrivateGameInformation): Promise<void> {
        await this.collection.insertOne(game);
    }

    async deleteGameInfoById(gameId: string): Promise<boolean> {
        const filter = { id: { $eq: gameId } };
        const deletedGame = (await this.collection.findOneAndDelete(filter)).value;

        if (deletedGame) {
            const imageIds = [deletedGame.idOriginalBmp, deletedGame.idEditedBmp, deletedGame.idDifferenceBmp];
            await this.bmpService.deleteGameImages(imageIds, this.srcPath);
        }

        return deletedGame !== null;
    }

    async deleteAllGamesInfo(): Promise<void> {
        await this.bmpService.deleteAllSourceImages(this.srcPath);
        await this.collection.deleteMany({});
    }

    async resetAllHighScores(): Promise<void> {
        await this.collection.updateMany({}, { $set: { soloScore: [], multiplayerScore: [] } });
    }

    async resetHighScores(gameId: string): Promise<void | null> {
        await this.collection.updateOne({ id: gameId }, { $set: { soloScore: [], multiplayerScore: [] } });
    }

    async getHighScores(gameId: string): Promise<{ soloScore: Score[]; multiplayerScore: Score[] } | null> {
        const game = await this.getGameInfoById(gameId);
        return { soloScore: game.soloScore, multiplayerScore: game.multiplayerScore };
    }

    async updateHighScores(gameId: string, soloScore: Score[], multiplayerScore: Score[]): Promise<void | null> {
        await this.collection.updateOne({ id: gameId }, { $set: { soloScore, multiplayerScore } });
    }
}
