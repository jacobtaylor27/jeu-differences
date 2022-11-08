import { Bmp } from '@app/classes/bmp/bmp';
import { PrivateGameInformation } from '@app/interface/game-info';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { GameInfoService } from '@app/services/game-info-service/game-info.service';
import { GameValidation } from '@app/services/game-validation-service/game-validation.service';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
// this import can't be imported without require
// eslint-disable-next-line @typescript-eslint/no-require-imports
import LZString = require('lz-string');

@Service()
export class GameController {
    router: Router;

    constructor(private gameInfo: GameInfoService, private gameValidation: GameValidation, private bmpSubtractor: BmpSubtractorService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

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
                                        thumbnail: 'data:image/png;base64,' + LZString.decompressFromUTF16(game.thumbnail),
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
                res.status(StatusCodes.BAD_REQUEST).send();
            }
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
    }
}
