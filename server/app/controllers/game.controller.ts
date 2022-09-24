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

        this.router.get('/', (req: Request, res: Response) => {
            console.log(req);
            console.log(res);
        });

        // TODO: routing
        // Pour démarer une partie
        // get(game/bmp/src/:id); // maybe utiliser original à la place de src
        // get(game/bmp/modified/:id);
        // Durant le jeux: validation des coordonnées
        // get(game/validate/:id/coord?)

        // Validation des différences entre les bmps
        // post(game/validate/bmp);
        // Créer un jeux
        // post(game)

        // carouselle
        // get(game/cards);
        // get(game/card/:id);
        // delete(game/:id);
    }
}
