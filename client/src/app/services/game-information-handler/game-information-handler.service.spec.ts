import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GameInformationHandlerService } from './game-information-handler.service';

describe('GameInformationHandlerService', () => {
    let service: GameInformationHandlerService;
    // let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
        });

        service = TestBed.inject(GameInformationHandlerService);
        //router = TestBed.inject(Router);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // it('should set the name', () => {
    //     service.setPlayerName('test');
    //     expect(service.playerName).toBe('test');
    // });
});
