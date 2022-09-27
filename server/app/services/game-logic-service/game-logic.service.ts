import { GameService } from '@app/services/';
import { Bmp } from '@common/bmp';
import { Coordinate } from '@common/coordinate';
import { Difference } from '@common/difference';
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
    async validateDifferenceBmp(originalBmp, modifiedBmp: Bmp): Promise<Difference> {
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
