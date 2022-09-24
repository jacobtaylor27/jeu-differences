import { ExampleService } from '@app/services/example.service';
import { Message } from '@common/message';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

const HTTP_STATUS_CREATED = 201;

@Service()
export class BmpController {
    router: Router;

    constructor(private readonly exampleService: ExampleService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/coordinates/', async (req: Request, res: Response) => {
            // Send the request to the service and send the response
            const time: Message = await this.exampleService.helloWorld();
            res.json(time);
        });

        this.router.get('/about', (req: Request, res: Response) => {
            // Send the request to the service and send the response
            res.json(this.exampleService.about());
        });

        this.router.post('/send', (req: Request, res: Response) => {
            const message: Message = req.body;
            this.exampleService.storeMessage(message);
            res.sendStatus(HTTP_STATUS_CREATED);
        });

        this.router.get('/all', (req: Request, res: Response) => {
            res.json(this.exampleService.getAllMessages());
        });
    }
}
