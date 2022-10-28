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

    it('should set CreateGame to true when on CreateGamePage', () => {
        service.setCreateGamePage();
        expect(service.currentPage.CreateGame);
        expect(!service.currentPage.Game);
        expect(!service.currentPage.WaitingRoom);
    });

    it('should set Game to true when on GamePage', () => {
        service.setGamePage();
        expect(service.currentPage.Game);
        expect(!service.currentPage.CreateGame);
        expect(!service.currentPage.WaitingRoom);
    });

    it('should set WaitingRoom to true when on WaitingRoom', () => {
        service.setWaitingRoom();
        expect(service.currentPage.WaitingRoom);
        expect(!service.currentPage.CreateGame);
        expect(!service.currentPage.Game);
    });

    it('should return correct title', () => {
        service.currentPage = {Game : false, CreateGame: false, WaitingRoom :false}
        expect(service.getTitle()).toEqual('');
        service.setGamePage();
        let expectedMessage = 'Quitter la partie ?';
        let message = service.getTitle();
        expect(message).toEqual(expectedMessage);

        service.setCreateGamePage();
        expectedMessage = 'Quitter la création ?';
        message = service.getTitle();
        expect(message).toEqual(expectedMessage);

        service.setWaitingRoom();
        expectedMessage = "Quitter la salle d'attente ?";
        message = service.getTitle();
        expect(message).toEqual(expectedMessage);
    });

    it('should return correct message', () => {
        service.setGamePage();
        let expectedMessage = 'Êtes-vous certain de vouloir quitter ? Votre progrès ne sera pas sauvegardé.';
        let message = service.getMessage();
        expect(message).toEqual(expectedMessage);

        service.setCreateGamePage();
        message = service.getMessage();
        expect(message).toEqual(expectedMessage);

        service.setWaitingRoom();
        expectedMessage = 'Êtes-vous certain de vouloir quitter ? Vous serez redirigés vers la page de sélection de jeu.';
        message = service.getMessage();
        expect(message).toEqual(expectedMessage);
    });
});
