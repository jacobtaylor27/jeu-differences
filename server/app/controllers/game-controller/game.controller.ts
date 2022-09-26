import { HTTP_STATUS } from '@app/constants/http-status';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { GameService } from '@app/services/game-service/game.service';
import { GameCard } from '@common/game-card';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

@Service()
export class GameController {
    router: Router;

    constructor(private readonly bmpService: BmpService, private readonly gameService: GameService) {
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
         * /api/game/bmp/{id}:
         *   get:
         *     tags:
         *       - GameController
         *     description: get the original bmp of the corresponding id
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
         *         description: The message containing the bmp was sent correctly.
         *       404:
         *         description: The id asked for was not found in the file present on the server.
         */
        this.router.get('/bmp/:id', async (req: Request, res: Response) => {
            this.bmpService.initialiseBmps();
            const bmpSelected = this.bmpService.getBmpById(parseInt(req.params.id, 10));
            if (bmpSelected) console.log(bmpSelected);
            // res.status(HTTP_STATUS.ok).json(bmpSelected);
            res.sendFile('./../assets/test-bmp/test_bmp_original.bmp');
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

        this.router.post('/', (req: Request, res: Response) => {
        });
        */

        this.router.get('cards', (req: Request, res: Response) => {
            const gameCards: GameCard[] = this.gameService.getAllGameCards();
            if (gameCards?.length !== 0) {
                res.status(HTTP_STATUS.ok).json(gameCards);
            } else {
                res.sendStatus(HTTP_STATUS.notFound);
            }
        });

        this.router.get('card/:id', (req: Request, res: Response) => {
            const gameCard = this.gameService.getGameCardById(parseInt(req.params.id, 10));
            if (gameCard) {
                res.status(HTTP_STATUS.ok).json(gameCard);
            } else {
                res.sendStatus(HTTP_STATUS.notFound);
            }
        });

        this.router.delete('/:id', (req: Request, res: Response) => {
            const deletedGame = this.gameService.deleteGameById(parseInt(req.params.id, 10));
            if (deletedGame) {
                res.status(HTTP_STATUS.accepted).json(deletedGame);
            } else {
                res.sendStatus(HTTP_STATUS.notFound);
            }
        });
    }
}
