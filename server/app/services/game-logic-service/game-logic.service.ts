import { GameService } from '@app/services/game-service/game.service';
import { Coordinate } from '@common/coordinate';
import { Service } from 'typedi';
@Service()
export class GameLogicService {
    constructor(private readonly gameService: GameService) {}

    // à la place de renvoyer undefined, renvoyer une erreur
    async validateCoordinates(gameId: number, coordinate: Coordinate): Promise<Coordinate[] | undefined> {
        const game = await this.gameService.getGameById(gameId);
        if (game === undefined) return undefined;

        for (const areaOfDifference of game.differences) {
            for (const coordDiff of areaOfDifference) {
                if (coordinate.row === coordDiff.row && coordinate.column === coordDiff.column) {
                    return areaOfDifference;
                }
            }
        }
        return undefined;
    }
}
