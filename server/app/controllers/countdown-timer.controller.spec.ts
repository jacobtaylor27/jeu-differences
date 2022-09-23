import { Application } from '@app/app';
import { CountdownTimerService } from '@app/services/clock/countdown-timer.service';
import { Message } from '@common/message';
import * as chai from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

const HTTP_STATUS_OK = StatusCodes.OK;

describe('CountdownTimerController', () => {
    let countdownTimerService: SinonStubbedInstance<CountdownTimerService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        countdownTimerService = createStubInstance(CountdownTimerService);
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['CountdownTimerService'], 'CountdownTimerService', { value: CountdownTimerService, writable: true });
        expressApp = app.app;
    });

    it('should return timer from CountdownTimerService on get request', async () => {
        const expectedMessage: Message = { title: 'Timer', body: '00 : 00' };
        countdownTimerService.sendTimerValue();

        return supertest(expressApp)
            .get('/api/game')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                chai.expect(response.body).to.deep.equal(expectedMessage);
            });
    });

    it('should return an error as a message on service fail', async () => {
        countdownTimerService.sendTimerValue.rejects(new Error('service error'));

        return supertest(expressApp)
            .get('/api/game')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                chai.expect(response.body.title).to.equal('Error');
            });
    });
});
