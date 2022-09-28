import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { Bmp } from '@app/classes/bmp/bmp';
import { BmpConverterService } from '@app/services/bmp-converter-service/bmp-converter.service';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { GameService } from '@app/services/game-service/game.service';
import { BmpMessage } from '@common/bmp-message';
import { Coordinate } from '@common/coordinate';
import { Difference } from '@common/difference';
import { Game } from '@common/game';
import { Service } from 'typedi';
@Service()
export class GameLogicService {
    constructor(
        private readonly gameService: GameService,
        private readonly bmpSubtractorService: BmpSubtractorService,
        private readonly bmpInterpreterService: BmpDifferenceInterpreter,
        private readonly bmpConverterService: BmpConverterService,
    ) {}

    // à la place de renvoyer undefined, renvoyer une erreur
    async validateCoordinates(gameId: number, coordinate: Coordinate): Promise<Coordinate[] | undefined> {
        const game: Game = await this.gameService.getGameById(gameId);
        for (const lineOfCoordinates of game.differences) {
            for (const difference of lineOfCoordinates) {
                if (difference.x === coordinate.x && difference.y === coordinate.y) {
                    return lineOfCoordinates;
                }
            }
        }
        return undefined;
    }
    async validateNewGameBmp(originalBmpMessage: BmpMessage, modifiedBmpMessage: BmpMessage, radius: number): Promise<Difference> {
        const originalBmp: Bmp = await this.bmpConverterService.convertAToBmp(originalBmpMessage.file);
        const modifiedBmp: Bmp = await this.bmpConverterService.convertAToBmp(modifiedBmpMessage.file);

        const differenceBmp: Bmp = await this.bmpSubtractorService.getDifferenceBMP(originalBmp, modifiedBmp, radius);
        const differenceFile: string = await this.bmpConverterService.convertBmpToA(differenceBmp);
        const coordinatesOfDifferences: BmpCoordinate[][] = await this.bmpInterpreterService.getCoordinates(differenceBmp);
        const nbOfDifference: number = coordinatesOfDifferences.length;
        const difference: Difference = {
            nbDifference: nbOfDifference,
            file: differenceFile,
        };
        return difference;
    }
}
