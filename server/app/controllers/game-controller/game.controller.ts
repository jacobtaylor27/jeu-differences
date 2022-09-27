import { Router } from 'express';
import { Service } from 'typedi';

@Service()
export class GameController {
    router: Router;

    constructor() {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        /**
         * @swagger
         *
         * definitions:
         *   Message:
         *     type: object
         *     properties:
         *       title:
         *         type: string
         *       body:
         *         type: string
         */

        /**
         * @swagger
         * tags:
         *   - name: GameController
         *     description: Responsable for sending the bmp.
         */

        /**
         * @swagger
         *
         * /api/game/cards:
         *   get:
         *     tags:
         *       - GameController
         *     description: get all of the cards
         *     responses:
         *       200:
         *         description: the cards were send correctly
         *       404:
         *         description: no cards were found
         */
        /* Non nécessaire au sprint 1
        this.router.get('cards', (req: Request, res: Response) => {
            const gameCards: GameCard[] = this.gameService.getAllGameCards();
            if (gameCards?.length !== 0) {
                res.status(HTTP_STATUS.ok).json(gameCards);
            } else {
                res.sendStatus(HTTP_STATUS.notFound);
            }
        });
        */

        /**
         * @swagger
         *
         * /api/game/card/{id}:
         *   get:
         *     tags:
         *       - GameController
         *     description: get the game card of a game based on a game id
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *           minimum: 1
         *         description: The id of a bmp.
         *     responses:
         *       200:
         *         description: The game card was found and send
         *       404:
         *         description: The id asked for was not found in the file present on the server.
         */
        /* Non nécessaire au sprint 1
        this.router.get('card/:id', (req: Request, res: Response) => {
            const gameCard = this.gameService.getGameCardById(parseInt(req.params.id, 10));
            if (gameCard) {
                res.status(HTTP_STATUS.ok).json(gameCard);
            } else {
                res.sendStatus(HTTP_STATUS.notFound);
            }
        });
        */

        /**
         * @swagger
         *
         * /api/game/{id}:
         *   delete:
         *     tags:
         *       - GameController
         *     description: deletes a game based on its gameId
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *           minimum: 1
         *         description: The id of the game.
         *     responses:
         *       202:
         *         description: The game was deleted
         *       404:
         *         description: The id of the game was not found
         */
        /* Non nécessaire au sprint 1
        this.router.delete('/:id', (req: Request, res: Response) => {
            const deletedGame = this.gameService.deleteGameById(parseInt(req.params.id, 10));
            if (deletedGame) {
                res.status(HTTP_STATUS.accepted).json(deletedGame);
            } else {
                res.sendStatus(HTTP_STATUS.notFound);
            }
        });
        */

        /*
        this.router.post('/', (req: Request, res: Response) => {
        });
        */

        /*
        this.router.get('/validate/bmp', (req: Request, res: Response) => {
            // TODO: retourne le nommbre de différences et un image de différence
        });
        
        this.router.get('/validate/:id/coord?', (req: Request, res: Response) => {
            // TODO: 
            // HTTP_STATUS.ACCEPTED (202)
            //      return differenceArea = [{pixel, coordonnées},...]
            // HTTP_STATUS.NOT_ACCEPTED (406)
        });
        */
    }
}
