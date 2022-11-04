import { Bmp } from '@app/classes/bmp/bmp';
import { PrivateGameInformation } from '@app/interface/game-info';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { GameInfoService } from '@app/services/game-info-service/game-info.service';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { GameValidation } from '@app/services/game-validation-service/game-validation.service';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import LZString = require('lz-string');
import { Service } from 'typedi';

@Service()
export class GameController {
    router: Router;
    // justification: nous avons encapsule la logique dans different service. Le controller s occupe d appeler ces service
    // eslint-disable-next-line max-params
    constructor(
        private gameManager: GameManagerService,
        private gameInfo: GameInfoService,
        private gameValidation: GameValidation,
        private bmpSubtractor: BmpSubtractorService,
    ) {
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
        this.router.delete('/cards/:id', (req: Request, res: Response) => {
            const isGameDeleted = this.gameInfo.deleteGameInfoById(req.params.id.toString());
            isGameDeleted
                .then((isDeleted) => {
                    const status = isDeleted ? StatusCodes.ACCEPTED : StatusCodes.NOT_FOUND;
                    res.status(status).send();
                })
                .catch(() => {
                    res.status(StatusCodes.BAD_REQUEST).send();
                });
        });

        this.router.delete('/cards', (req: Request, res: Response) => {
            this.gameInfo
                .deleteAllGamesInfo()
                .then(() => {
                    res.status(StatusCodes.ACCEPTED).send();
                })
                .catch(() => {
                    res.status(StatusCodes.BAD_REQUEST).send();
                });
        });

        this.router.get('/cards', (req: Request, res: Response) => {
            const page = req.query.page;
            if (page) {
                const pageNb = parseInt(page.toString(), 10);
                this.gameInfo
                    .getGamesInfo(pageNb)
                    .then(
                        (gameCarousel: {
                            games: PrivateGameInformation[];
                            information: {
                                currentPage: number;
                                gamesOnPage: number;
                                nbOfGames: number;
                                nbOfPages: number;
                                hasNext: boolean;
                                hasPrevious: boolean;
                            };
                        }) => {
                            res.status(StatusCodes.OK).send({
                                carouselInfo: gameCarousel.information,
                                games: gameCarousel.games.map((game: PrivateGameInformation) => {
                                    return {
                                        id: game.id,
                                        name: game.name,
                                        thumbnail: game.thumbnail,
                                        nbDifferences: game.differences.length,
                                        idEditedBmp: game.idEditedBmp,
                                        idOriginalBmp: game.idOriginalBmp,
                                        multiplayerScore: game.multiplayerScore,
                                        soloScore: game.soloScore,
                                    };
                                }),
                            });
                        },
                    )
                    .catch(() => {
                        res.status(StatusCodes.BAD_REQUEST).send();
                    });
            } else {
                this.gameInfo
                    .getAllGameInfos()
                    .then((games: PrivateGameInformation[]) => {
                        res.status(StatusCodes.OK).send({
                            games: games.map((game: PrivateGameInformation) => {
                                return {
                                    id: game.id,
                                    name: game.name,
                                    thumbnail: game.thumbnail,
                                    nbDifferences: game.differences.length,
                                    idEditedBmp: game.idEditedBmp,
                                    idOriginalBmp: game.idOriginalBmp,
                                    multiplayerScore: game.multiplayerScore,
                                    soloScore: game.soloScore,
                                };
                            }),
                        });
                    })
                    .catch(() => {
                        res.status(StatusCodes.NOT_FOUND).send();
                    });
            }
        });

        this.router.get('/cards/:id', (req: Request, res: Response) => {
            this.gameInfo
                .getGameInfoById(req.params.id)
                .then((game: PrivateGameInformation) => {
                    res.status(StatusCodes.OK).send({
                        game: {
                            id: game.id,
                            name: game.name,
                            thumbnail: game.thumbnail,
                            nbDifferences: game.differences.length,
                            idOriginalBmp: game.idOriginalBmp,
                            idEditedBmp: game.idEditedBmp,
                            multiplayerScore: game.multiplayerScore,
                            soloScore: game.soloScore,
                        },
                    });
                })
                .catch(() => {
                    res.status(StatusCodes.NOT_FOUND).send();
                });
        });

        this.router.post('/card/validation', async (req: Request, res: Response) => {
            if (!req.body.original || !req.body.modify || req.body.differenceRadius === undefined) {
                res.status(StatusCodes.BAD_REQUEST).send();
                return;
            }
            try {
                const original = new Bmp({ width: req.body.original.width, height: req.body.original.height }, req.body.original.data as number[]);
                const modify = new Bmp({ width: req.body.modify.width, height: req.body.modify.height }, req.body.modify.data as number[]);
                const numberDifference = await this.gameValidation.numberDifference(original, modify, req.body.differenceRadius as number);
                const differenceImage = await this.bmpSubtractor.getDifferenceBMP(original, modify, req.body.differenceRadius as number);
                res.status(
                    (await this.gameValidation.isNbDifferenceValid(original, modify, req.body.differenceRadius as number))
                        ? StatusCodes.ACCEPTED
                        : StatusCodes.NOT_ACCEPTABLE,
                ).send({
                    numberDifference,
                    width: differenceImage.getWidth(),
                    height: differenceImage.getHeight(),
                    data: Array.from((await differenceImage.toImageData()).data),
                });
            } catch (e) {
                res.status(StatusCodes.NOT_FOUND).send();
            }
        });

        this.router.post('/card', async (req: Request, res: Response) => {
            if (!req.body.original || !req.body.modify || req.body.differenceRadius === undefined || req.body.name === undefined) {
                res.status(StatusCodes.BAD_REQUEST).send();
                return;
            }
            const original = new Bmp(
                { width: req.body.original.width, height: req.body.original.height },
                await Bmp.convertRGBAToARGB(req.body.original.data),
            );
            const modify = new Bmp(
                { width: req.body.modify.width, height: req.body.modify.height },
                await Bmp.convertRGBAToARGB(req.body.modify.data),
            );
            this.gameInfo
                .addGameInfoWrapper({ original, modify }, req.body.name, req.body.differenceRadius)
                .then(() => {
                    res.status(StatusCodes.CREATED).send();
                })
                .catch(() => {
                    res.status(StatusCodes.NOT_ACCEPTABLE).send();
                });
        });

        this.router.post('/create/:id', (req: Request, res: Response) => {
            if (!req.body.players || req.body.players.length === 0 || !req.body.mode || !req.params.id) {
                res.status(StatusCodes.BAD_REQUEST).send();
                return;
            }
            this.gameManager
                .createGame({ player: req.body.players, isMulti: false }, req.body.mode as string, req.params.id)
                .then((gameId: string) => {
                    res.status(StatusCodes.CREATED).send({ id: gameId });
                })
                .catch(() => {
                    res.status(StatusCodes.NOT_FOUND).send();
                });
        });

        this.router.post('/difference', (req: Request, res: Response) => {
            if (req.body.x === undefined || req.body.y === undefined || !this.gameManager.isGameFound(req.body.id)) {
                res.status(StatusCodes.BAD_REQUEST).send();
                return;
            }
            const difference = this.gameManager.isDifference(req.body.id as string, {
                x: req.body.x,
                y: req.body.y,
            });
            if (difference === null) {
                res.status(StatusCodes.NOT_FOUND).send();
                return;
            }
            res.status(StatusCodes.OK).send({
                difference,
                isGameOver: this.gameManager.isGameOver(req.body.id),
                differencesLeft: this.gameManager.nbDifferencesLeft(req.body.id),
            });
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
