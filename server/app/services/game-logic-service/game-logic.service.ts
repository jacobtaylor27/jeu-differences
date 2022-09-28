import { GameService } from '@app/services/game-service/game.service';
import { Bmp } from '@common/bmp';
import { Coordinate } from '@common/coordinate';
import { Difference } from '@common/difference';
import { Game } from '@common/game';
import { Service } from 'typedi';
@Service()
export class GameLogicService {
    constructor(private readonly gameService: GameService) {}

    // à la place de renvoyer undefined, renvoyer une erreur
    async validateCoordinates(gameId: number, coordinate: Coordinate): Promise<Coordinate[] | undefined> {
        const game: Game = await this.gameService.getGameById(gameId);
        for (const lineOfCoordinates of game.differences) {
            for (const difference of lineOfCoordinates) {
                if (difference.column === coordinate.column && difference.row === coordinate.column) {
                    return lineOfCoordinates;
                }
            }
        }
        return undefined;
    }
    async validateDifferenceBmp(originalBmp: Bmp, modifiedBmp: Bmp): Promise<Difference> {
        console.log(originalBmp);
        console.log(modifiedBmp);
        const difference: Difference = {
            id: 0,
            nbDifference: 0,
            file: '',
        };
        return difference;
    }
}
