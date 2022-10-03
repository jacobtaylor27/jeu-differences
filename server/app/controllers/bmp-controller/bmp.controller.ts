import { BmpService } from '@app/services/bmp-service/bmp.service';
import { DateService } from '@app/services/date-service/date.service';
import { Message } from '@common/message';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

@Service()
export class BmpController {
    router: Router;

    constructor(private readonly bmpService: BmpService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/id', (req: Request, res: Response) => {
            


            this.dateService
                .currentTime()
                .then((time: Message) => {
                    res.json(time);
                })
                .catch((reason: unknown) => {
                    const errorMessage: Message = {
                        title: 'Error',
                        body: reason as string,
                    };
                    res.json(errorMessage);
                });
        });
    }
}
