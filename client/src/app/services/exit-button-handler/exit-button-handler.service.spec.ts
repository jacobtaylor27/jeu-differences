import { TestBed } from '@angular/core/testing';

import { ExitButtonHandlerService } from './exit-button-handler.service';

describe('ExitButtonHandlerService', () => {
    let service: ExitButtonHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ExitButtonHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set isOnGamePage to false when on CreateGamePage', () => {
        service.setCreateGamePage();
        expect(!service.isOnGamePage);
    });

    it('should set isOnGamePage to true when on GamePage', () => {
        service.setGamePage();
        expect(service.isOnGamePage);
    });

    it('should return correct message', () => {
        service.isOnGamePage = true;
        let expectedMessage = 'Quitter la partie ?';
        let message = service.getMessage();
        expect(message).toEqual(expectedMessage);

        service.isOnGamePage = false;
        expectedMessage = 'Quitter la création ?';
        message = service.getMessage();
        expect(message).toEqual(expectedMessage);
    });
});
