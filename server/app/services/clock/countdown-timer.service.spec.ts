import { CountdownTimerService } from '@app/services/clock/countdown-timer.service';
import { expect } from 'chai';
import { Container } from 'typedi';

describe('Countdown timer Service', () => {
    let countdownTimerService: CountdownTimerService;

    beforeEach(async () => {
        countdownTimerService = Container.get(CountdownTimerService);
    });

    it('sendTimerValue should return a valid message', () => {
        const result = countdownTimerService.sendTimerValue();
        expect(result.title).to.equal('Timervalue');
        expect(result.body).to.equal(countdownTimerService['valueTimer'].toString());
    });

    it('should not send timer bigger than two minutes', () => {
        const countdownTimerServiceTest = new CountdownTimerService(0, 3);
        const result = countdownTimerServiceTest.sendTimerValue();
        expect(result.body).to.equal('120');
    });

    it('checkBoundary should set 2 minutes if admin enters more than that', () => {
        const countdownTimerServiceTest = new CountdownTimerService(122, 0);
        countdownTimerService['checkBoundaryTime']();
        expect(countdownTimerServiceTest['seconds']).to.equal(0);
        expect(countdownTimerServiceTest['minutes']).to.equal(2);
    });
});
