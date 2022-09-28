import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpEncoderService } from '@app/services/bmp-encoder-service/bmp-encoder.service';
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
        private readonly bmpEncoderService: BmpEncoderService,
        private readonly bmpInterpreterService: BmpDifferenceInterpreter,
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
    async validateNewGameBmp(originalBmp: BmpMessage, modifiedBmp: BmpMessage, radius: number): Promise<Difference> {
        // const bmpOfDifference: Bmp = await this.bmpSubtractorService.getDifferenceBMP(originalBmp, modifiedBmp, radius);
        console.log(originalBmp);
        console.log(modifiedBmp);
        console.log(radius);
        console.log(this.bmpEncoderService);
        console.log(this.bmpInterpreterService);
        console.log(this.bmpSubtractorService);
        // const bmpConvertedIntoASCII: string = await this.bmpEncoderService.encodeIntoASCII(bmpOfDifference);
        // const nbOfDifference = await this.bmpInterpreterService.getCoordinates(bmpOfDifference);
        const difference: Difference = {
            nbDifference: 0,
            file: '',
        };
        return difference;
    }
}
