import { HttpException } from '@app/classes/http/http.exception';
import { GameController } from '@app/controllers/game-controller/game.controller';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
import { BmpController } from './controllers/bmp-controller/bmp.controller';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import * as compression from 'compression';

@Service()
export class Application {
    app: express.Application;
    private readonly internalError: number = StatusCodes.INTERNAL_SERVER_ERROR;
    private readonly swaggerOptions: swaggerJSDoc.Options;

    constructor(private readonly gameController: GameController, private readonly bmpController: BmpController) {
        this.app = express();

        this.swaggerOptions = {
            swaggerDefinition: {
                openapi: '3.0.0',
                info: {
                    title: 'Cadriciel Serveur',
                    version: '1.0.0',
                },
            },
            apis: ['**/*.ts'],
        };

        this.config();

        this.bindRoutes();
    }

    bindRoutes(): void {
        this.app.use('/api/game', this.gameController.router);
        this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(this.swaggerOptions)));
        this.app.use('/api/bmp', this.bmpController.router);
        this.app.use('/', (req, res) => {
            res.redirect('/api/docs');
        });
        this.errorHandling();
    }

    private config(): void {
        // Middlewares configuration
        this.app.use(express.json({ limit: '100mb' }));
        this.app.use(express.urlencoded({ limit: '100mb', extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors());
        this.app.use(compression());
    }

    private errorHandling(): void {
        // When previous handlers have not served a request: path wasn't found
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: HttpException = new HttpException('Not Found');
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use((err: HttpException, req: express.Request, res: express.Response) => {
                res.status(err.status || this.internalError);
                res.send({
                    message: err.message,
                    error: err,
                });
            });
        }

        // production error handler
        // no stacktraces  leaked to user (in production env only)
        this.app.use((err: HttpException, req: express.Request, res: express.Response) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }
}
