import { Game } from '@app/classes/game/game';
import { Coordinate } from '@common/coordinate';
import { GameMode } from '@common/game-mode';
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

    isDifferenceFound(playerId: string, difference: Coordinate, game: Game) {
        const differences = this.findDifference(difference, game.information.differences);
        if (!differences || this.isDifferenceAlreadyFound(differences, game.identifier)) {
            return null;
        }
        this.addCoordinatesOnDifferenceFound(playerId, differences, game);
        return differences;
    }

    addCoordinatesOnDifferenceFound(playerId: string, differenceCoords: Coordinate[], game: Game) {
        const player = this.gamesDifferencesFound.get(game.identifier)?.get(playerId);
        if (this.isDifferenceAlreadyFound(differenceCoords, game.identifier) || !player) {
            return;
        }
        this.gamesDifferencesTotalFound.get(game.identifier)?.add(differenceCoords);
        player.add(differenceCoords);
        if (this.isAllDifferenceFound(playerId, game) && !game.isGameOver() && game.gameMode === GameMode.Classic) {
            game.setEndgame();
        }
    }

    isDifferenceAlreadyFound(differenceCoords: Coordinate[], gameId: string) {
        return this.gamesDifferencesTotalFound.get(gameId)?.has(differenceCoords);
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

    getNbDifferencesThreshold(differencesRef: Coordinate[][]) {
        return differencesRef.length % 2 === 0 ? differencesRef.length / 2 : Math.trunc(differencesRef.length / 2) + 1;
    }


    nbDifferencesLeft(differencesRef: Coordinate[][], gameId: string): number {
        return differencesRef.length - (this.gamesDifferencesTotalFound.get(gameId) as Set<Coordinate[]>).size;
    }
}
