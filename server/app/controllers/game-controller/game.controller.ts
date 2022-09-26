import { HTTP_STATUS } from '@app/constants/http-status';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

@Service()
export class GameController {
    router: Router;

    constructor(private readonly bmpService: BmpService) {
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
        this.router.get('/bmp/:id', (req: Request, res: Response) => {
            const bmpSelected = this.bmpService.getBmpById(parseInt(req.params.id, 10));
            res.status(HTTP_STATUS.ok).json(bmpSelected);
        });
        /*
        // service de game
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
        this.router.get('cards', (req: Request, res: Response) => {
        });
        this.router.get('card/:id', (req: Request, res: Response) => {
        });
        this.router.delete('/:id', (req: Request, res: Response) => {
        });
        */
    }
}
