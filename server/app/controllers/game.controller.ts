import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

@Service()
export class GameController {
    router: Router;

    constructor() {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/bmp/original/:id', (req: Request, res: Response) => {
            // TODO: retourne un bmp original
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
