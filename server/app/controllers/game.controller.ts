import { HTTP_STATUS } from '@app/constants/http-status';
import { BmpService } from '@app/services/bmp.service';
import { Request, Response, Router } from 'express';
import * as fs from 'fs';
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
         *     description: Responsable de s'occuper du déroulement d'une partie
         */

        /**
         * @swagger
         *
         * /api/game/bmp/original/{id}:
         *   get:
         *     description: get the original bmp of the corresponding id
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *           minimum: 1
         *         description: The id of a bmp
         *     responses:
         *       200:
         *         description: Ok
         */
        this.router.get('/bmp/original/:id', (req: Request, res: Response) => {
            console.log(this.bmpService.getBmp());
            fs.readFile('./assets/test-bmp/bmp_test_2x2.bmp', (file) => {
                res.status(HTTP_STATUS.ok).send(file);
            });
        });
        /*
        this.router.get('/bmp/modified/:id', (req: Request, res: Response) => {
            // TODO: retourne un bmp modifié
        });
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
