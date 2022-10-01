import { Bmp } from '@app/classes/bmp/bmp';
import { DB_GAME_COLLECTION, DEFAULT_BMP_ASSET_PATH } from '@app/constants/database';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { DatabaseService } from '@app/services/database-service/database.service';
import { DEFAULT_SCORE } from '@app/services/game-info-service/game-info.service.contants';
import { GameInfo } from '@common/game-info';
import { Collection } from 'mongodb';
import { Service } from 'typedi';
import { v4 } from 'uuid';
@Service()
export class GameService {
    // eslint-disable-next-line max-params
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly bmpService: BmpService,
        private readonly bmpSubtractorService: BmpSubtractorService,
        private readonly bmpDifferenceInterpreter: BmpDifferenceInterpreter,
    ) {}

    get collection(): Collection<GameInfo> {
        return this.databaseService.database.collection(DB_GAME_COLLECTION);
    }
    async getAllGames(): Promise<GameInfo[]> {
        return await this.collection.find({}).toArray();
    }
    async getGameById(gameId: string): Promise<GameInfo> {
        const filter = { id: gameId };
        return (await this.collection.find(filter).toArray())[0];
    }
    async addGame(game: GameInfo): Promise<boolean> {
        game.id = v4();
        game.soloScore = DEFAULT_SCORE;
        game.multiplayerScore = DEFAULT_SCORE;
        try {
            const originalBmp: Bmp = await this.bmpService.getBmpById(game.idOriginalBmp, DEFAULT_BMP_ASSET_PATH);
            const modifiedBmp: Bmp = await this.bmpService.getBmpById(game.idEditedBmp, DEFAULT_BMP_ASSET_PATH);

            const differenceBmp: Bmp = await this.bmpSubtractorService.getDifferenceBMP(originalBmp, modifiedBmp, game.differenceRadius);
            game.differences = await this.bmpDifferenceInterpreter.getCoordinates(differenceBmp);
            game.idDifferenceBmp = await this.bmpService.addBFromBmp(differenceBmp, DEFAULT_BMP_ASSET_PATH);
            await this.collection.insertOne(game);
            return true;
        } catch (error) {
            return false;
        }
    }
    async deleteGameById(gameId: string): Promise<boolean> {
        const filter = { id: { $eq: gameId } };
        return (await this.collection.findOneAndDelete(filter)).value !== null ? true : false;
    }
}
