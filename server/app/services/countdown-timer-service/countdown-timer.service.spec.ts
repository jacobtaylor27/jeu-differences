import { CountdownTimerService } from '@app/services/countdown-timer-service/countdown-timer.service';
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
        /* eslint-disable @typescript-eslint/no-magic-numbers -- magic number for test */
        expect(result.body).to.equal('120');
    });

    it('checkBoundarySeconds should set seconds and minutes correctly when seconds is bigger than 60 seconds', () => {
        /* eslint-disable @typescript-eslint/no-magic-numbers -- magic number for test */
        countdownTimerService['seconds'] = 66;
        countdownTimerService['checkBoundarySeconds']();
        expect(countdownTimerService['seconds']).to.equal(6);
        expect(countdownTimerService['minutes']).to.equal(1);
    });

    it('checkBoundaryTime should set seconds and minutes correctly', () => {
        const countdownTimerServiceTest = new CountdownTimerService(61, 1);
        countdownTimerServiceTest['checkBoundaryTime']();
        expect(countdownTimerServiceTest['valueTimer']).to.equal(120);
        expect(countdownTimerServiceTest['seconds']).to.equal(0);
    });
});
