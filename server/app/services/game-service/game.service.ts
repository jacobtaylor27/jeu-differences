import { Game } from '@common/game';
import { GameCard } from '@common/game-card';
import { Service } from 'typedi';

@Service()
export class GameService {
    private game: Game[];

    constructor() {
        this.game = [];
    }

    async initialiseGames() {
        // TODO: fetch toutes les parties avec mongoDb
        const basicGame: Game = {
            id: 0,
            idOriginalBmp: 0,
            idEditedBmp: 0,
            idDifferenceBmp: 0,
            bestTimes: '',
            name: 'firstGame',
            differences: [],
        };
        this.game.push(basicGame);
    }
    // à la place de renvoyer undefined, renvoyer une erreur
    getGameById(gameId: number): Game | undefined {
        for (const game of this.game) {
            if (game.id === gameId) {
                return game;
            }
        }
        return undefined;
    }
    // à la place de renvoyer undefined, renvoyer une erreur
    getGameCardById(gameId: number): GameCard | undefined {
        const game: Game | undefined = this.getGameById(gameId);
        if (game !== undefined) {
            return this.convertGameIntoGameCard(game);
        } else {
            return undefined;
        }
    }
    getAllGameCards() {
        const gameCards: GameCard[] = [];
        this.game.forEach((game) => {
            gameCards.push(this.convertGameIntoGameCard(game));
        });
        return gameCards;
    }
    addGame(game: Game): boolean {
        // Il faudrait que ce ne soit pas une interface directement qui soit passé en paramètre, mais peut-être les attributs de l'objet?
        // TODO: initialiser son attribut Id.
        if (!this.verifyIfGameAlreadyExists(game.id)) {
            this.game.push(game);
            return true;
        }
        return false;
    }
    deleteGameById(gameId: number): Game | undefined {
        for (let i = 0; i < this.game.length; i++) {
            if (this.game[i].id === gameId) {
                const nbOfElementToDelete = 1;
                return this.game.splice(i, nbOfElementToDelete)[0];
            }
        }
        return undefined;
    }
    private verifyIfGameAlreadyExists(gameId: number): boolean {
        for (const game of this.game) {
            if (game.id === gameId) {
                return true;
            }
        }
        return false;
    }
    private convertGameIntoGameCard(game: Game): GameCard {
        const gameCard: GameCard = {
            id: game.id,
            idOriginalBmp: game.idOriginalBmp,
            bestTimes: game.bestTimes,
            name: game.name,
        };
        return gameCard;
    }
}
