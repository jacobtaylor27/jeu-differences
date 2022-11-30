import { Coordinate } from '@common/coordinate';
import { Service } from 'typedi';

@Service()
export class DifferenceService {
    private gamesDifferencesFound: Map<string, Map<string, Set<Coordinate[]>>>;
    private gamesDifferencesTotalFound: Map<string, Set<Coordinate[]>>;

    constructor() {
        this.gamesDifferencesFound = new Map();
        this.gamesDifferencesTotalFound = new Map();
    }


    findDifference(differenceCoords: Coordinate, differencesRef: Coordinate[][]): Coordinate[] | undefined {
        return differencesRef.find((difference: Coordinate[]) =>
            difference.find((coord: Coordinate) => coord.x === differenceCoords.x && coord.y === differenceCoords.y),
        );
    }

    isAllDifferenceFound(playerId: string, game: Game): boolean {
        const player = this.gamesDifferencesFound.get(game.identifier)?.get(playerId);

        // if the game is already over all the differences are found and if the game is not initialize, 0 difference found
        if (game.isGameInitialize() || game.isGameOver() || !player) {
            return game.isGameOver();
        }

        return game.multi
            ? player.size === this.getNbDifferencesThreshold(game.information.differences)
            : player.size === game.information.differences.length;
    }

}
