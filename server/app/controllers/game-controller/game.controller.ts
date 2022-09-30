import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
import { Request, Response, Router } from 'express';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';

@Service()
export class GameController {
    router: Router;

    constructor(private gameManager: GameManagerService) {
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

        /**
         * @swagger
         *
         * /api/game/create/{id}/?{mode}?{players}:
         *   get:
         *     tags:
         *       - GameController
         *     description: create a game with a specific card, mode and players name
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The id of the gameCard.
         *      - in: path
         *          name: mode
         *          required: true
         *          schema:
         *              type: string
         *          description: the mode of the game
         *      - in: path
         *          name: players
         *          required: true
         *          schema:
         *              type: string[]
         *          description: the name of players
         *     responses:
         *       201:
         *         description: the game is created
         *      404:
         *          description the game does not have the id pass
         *      400:
         *         description: parameters are incorrect
         */
        this.router.get('/create/:id', (req: Request, res: Response) => {
            if (!req.query.players || !req.query.mode) {
                res.status(StatusCodes.BAD_REQUEST).send();
            }
            this.gameManager
                .createGame(req.query.players as string[], req.query.mode as string, parseInt(req.params.id as string, 10))
                .then((gameId: string) => {
                    res.status(StatusCodes.CREATED).send({ id: gameId });
                })
                .catch(() => {
                    res.status(StatusCodes.NOT_FOUND).send();
                });
        });

        /**
         * @swagger
         *
         * /api/game/difference/{id}/?{x}?{y}:
         *   get:
         *     tags:
         *       - GameController
         *     description: create a game with a specific card, mode and players name
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The id of the active game.
         *      - in: path
         *          name: x
         *          required: true
         *          schema:
         *              type: number
         *          description: x coordinate
         *      - in: path
         *          name: y
         *          required: true
         *          schema:
         *              type: number
         *          description: y coordinate
         *     responses:
         *       200:
         *         description: the game is created
         *      404:
         *          description the game does not have the id pass
         *      400:
         *          description: x and y not specified
         */
        this.router.get('/difference/:id', (req: Request, res: Response) => {
            if (!req.query.x || !req.query.y || this.gameManager.isGameFound(req.params.id)) {
                res.status(StatusCodes.BAD_REQUEST).send();
            }
            const difference = this.gameManager.isDifference(req.params.id as string, {
                x: parseInt(req.query.x as string, 10),
                y: parseInt(req.query.y as string, 10),
            });
            if (difference === null) {
                res.status(StatusCodes.NOT_FOUND).send();
            }
            res.status(StatusCodes.OK).send(difference);
        });

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
