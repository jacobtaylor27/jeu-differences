import { TestBed } from '@angular/core/testing';
import { GameInformationHandlerService } from './game-information-handler.service';

describe('GameInformationHandlerService', () => {
    let service: GameInformationHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameInformationHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    fit('should set the name', () => {
        service.setName('test');
        expect(service.name).toBe('test');
    });
});
