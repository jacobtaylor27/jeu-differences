import { BmpService } from '@app/services/bmp.service';
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
         *     description: Responsable de s'occuper du déroulement d'une partie
         */

        /**
         * @swagger
         *
         * /bmp/original/:id:
         *   get:
         *     description: Returns an unmodified bmp according to it's id
         *     tags:
         *       - GameController
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         schema:
         *           $ref: '#/definitions/Message'
         *
         */
        this.router.get('/bmp/original/:id', (req: Request, res: Response) => {
            const httpStatus = 404;
            console.log(this.bmpService.getBmp());
            res.send(httpStatus);
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
