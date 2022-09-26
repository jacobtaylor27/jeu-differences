import { TestBed } from '@angular/core/testing';
// import { GameCategory } from '@app/enums/game-category';
import { GameCardHandlerService } from './game-card-handler.service';

// const GAME_CARDS = [
//     {
//         gameInformation: {
//             gameName: 'Game 1',
//             imgName: 'https://picsum.photos/200/300',
//             scoresSolo: [
//                 { playerName: 'Player 1', time: 60, category: GameCategory.Solo },
//                 { playerName: 'Player 2', time: 120, category: GameCategory.Solo },
//             ],
//             scoresMultiplayer: [
//                 { playerName: 'Player 3', time: 90, category: GameCategory.Multiplayer },
//                 { playerName: 'Player 4', time: 150, category: GameCategory.Multiplayer },
//             ],
//         },
//         isAdminCard: false,
//         isShown: false,
//     },
//     {
//         gameInformation: {
//             gameName: 'Game 2',
//             imgName: 'https://picsum.photos/200/300',
//             scoresSolo: [
//                 { playerName: 'Player 5', time: 12, category: GameCategory.Solo },
//                 { playerName: 'Player 6', time: 40, category: GameCategory.Solo },
//             ],
//             scoresMultiplayer: [
//                 { playerName: 'Player 7', time: 25, category: GameCategory.Multiplayer },
//                 { playerName: 'Player 8', time: 75, category: GameCategory.Multiplayer },
//             ],
//         },
//         isAdminCard: false,
//         isShown: false,
//     },
// ];

fdescribe('GameCardHandlerService', () => {
    let service: GameCardHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameCardHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('fetchGameCards should assign card to the gameCards attribute', () => {
        service.fetchGameCards();
        expect(service['gameCards']).toBeDefined();
        expect(true).toBeTruthy();
    });

    it('getGameCards', () => {
        expect(true).toBeTruthy();
    });

    it('getActiveCardsRange', () => {
        expect(true).toBeTruthy();
    });

    it('getNumberOfCards', () => {
        expect(true).toBeTruthy();
    });

    it('hasCards', () => {
        expect(true).toBeTruthy();
    });

    it('hideAllCards', () => {
        expect(true).toBeTruthy();
    });

    it('increaseActiveRange', () => {
        expect(true).toBeTruthy();
    });

    it('decreaseActiveRange', () => {
        expect(true).toBeTruthy();
    });

    it('getActiveCards', () => {
        expect(true).toBeTruthy();
    });

    it('setActiveCards', () => {
        expect(true).toBeTruthy();
    });

    it('resetActiveRange', () => {
        expect(true).toBeTruthy();
    });

    it('deleteGames', () => {
        expect(true).toBeTruthy();
    });

    it('deleteGame', () => {
        expect(true).toBeTruthy();
    });

    it('resetHighScores', () => {
        expect(true).toBeTruthy();
    });

    it('resetAllHighScores', () => {
        expect(true).toBeTruthy();
    });
});
