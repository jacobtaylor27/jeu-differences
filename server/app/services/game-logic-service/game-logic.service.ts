import { GameService } from '@app/services/game-service/game.service';
import { Bmp } from '@common/bmp';
import { Coordinate } from '@common/coordinate';
import { Difference } from '@common/difference';
import { Service } from 'typedi';

@Service()
export class GameLogicService {
    constructor(private readonly gameService: GameService) {}

    // à la place de renvoyer undefined, renvoyer une erreur
    async validateCoordinates(gameId: number, coordinate: Coordinate): Promise<void> {
        console.log(gameId);
        console.log(coordinate);
        console.log(this.gameService);
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
