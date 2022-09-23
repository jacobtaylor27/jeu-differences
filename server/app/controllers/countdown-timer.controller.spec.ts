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
        Object.defineProperty(app['dateController'], 'countdownTimerService', { value: countdownTimerService, writable: true });
        expressApp = app.app;
    });

    it('should return time from countdownTimerService on get request', async () => {
        /* eslint-disable @typescript-eslint/no-magic-numbers -- body value for test */
        const expectedMessage: Message = { title: 'Timervalue', body: '20' };
        countdownTimerService.sendTimerValue();

        return supertest(expressApp)
            .get('/api/game')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                chai.expect(response.body).to.deep.equal(expectedMessage);
            });
    });
});
