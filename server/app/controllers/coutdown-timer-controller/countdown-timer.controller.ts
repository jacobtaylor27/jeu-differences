import { CountdownTimerService } from '@app/services/clock/countdown-timer.service';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

@Service()
export class CountdownTimerController {
    router: Router;

    constructor(private readonly timerService: CountdownTimerService) {
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
         *   - name: TIMER
         *     description:
         *   - name: Message
         *     description: Messages functions
         */

        /**
         * @swagger
         *
         * /api/game:
         *   get:
         *     description: Return current time with hello world
         *     tags:
         *       - TIMER
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         schema:
         *           $ref: '#/definitions/Message'
         *
         */
        this.router.get('/', async (req: Request, res: Response) => {
            res.json(this.timerService.sendTimerValue());
        });
    }
}
