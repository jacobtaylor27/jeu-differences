/* eslint-disable @typescript-eslint/no-magic-numbers */
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
        expect(service['gameCards'].length).toBeGreaterThan(0);
    });

    it('getGameCards should return the cards array', () => {
        const returnValue = service.getGameCards();
        expect(returnValue).toBeDefined();
        expect(returnValue).toBeInstanceOf(Array);
    });

    it('getActiveCardsRange should return the active range of cards', () => {
        const returnValue = service.getActiveCardsRange();
        expect(returnValue).toBeDefined();
        expect(returnValue).toEqual({ start: 0, end: 3 });
    });

    it('getNumberOfCards should return the number of cards in the list', () => {
        const returnValue = service.getNumberOfCards();
        expect(returnValue).toBeTruthy();
        expect(returnValue).toBeGreaterThan(0);
    });

    it('hasCards should return true if the array contains a game card', () => {
        const returnValue = service.hasCards();
        expect(returnValue).toBeTruthy();

        service['gameCards'] = [];
        expect(service.hasCards()).toBeFalsy();
    });

    it('hideAllCards should set the isShown attribute to false for each card', () => {
        service.hideAllCards();
        for (const card of service['gameCards']) {
            expect(card.isShown).toBeFalsy();
        }
    });

    it('increaseActiveRange should increase starting and ending range by 4', () => {
        service.increaseActiveRange();
        expect(service['activeCardsRange']).toEqual({ start: 4, end: 7 });
    });

    it('decreaseActiveRange should decrease starting and ending range by 4', () => {
        service['activeCardsRange'] = { start: 4, end: 7 };
        service.decreaseActiveRange();
        expect(service['activeCardsRange']).toEqual({ start: 0, end: 3 });
    });

    it('getActiveCards should return the cards that have the isShown attribute set to true', () => {
        let returnValue = service.getActiveCards();
        expect(returnValue.length).toEqual(4);
        expect(returnValue).toBeDefined();
        expect(returnValue).toBeInstanceOf(Array);
        expect(returnValue.length).toBeGreaterThan(0);

        service['gameCards'][0].isShown = false;
        returnValue = service.getActiveCards();
        expect(returnValue.length).toEqual(3);
    });

    it('setActiveCards should set active card from range parameter', () => {
        service.setActiveCards({ start: 10, end: 13 });
        expect(service['gameCards'][10].isShown).toBeTruthy();
        expect(service['gameCards'][13].isShown).toBeTruthy();
    });

    it('resetActiveRange should set to default value of 0 and 3', () => {
        service.setActiveCards({ start: 10, end: 14 });
        service.resetActiveRange();
        expect(service['activeCardsRange']).toEqual({ start: 0, end: 3 });
    });

    it('deleteGames should delete all games from list', () => {
        expect(service['gameCards'].length).toBeGreaterThan(0);
        service.deleteGames();
        expect(service['gameCards'].length).toEqual(0);
    });

    it('deleteGame should remove a specified game from the array', () => {
        expect(service['gameCards'].length).toEqual(18);
        service.deleteGame(service['gameCards'][0]);
        service.deleteGame(service['gameCards'][6]);
        expect(service['gameCards'].length).toEqual(16);
    });

    it('resetHighScores should reset scores for a given game', () => {
        expect(service['gameCards'][0].gameInformation.scoresSolo.length).toEqual(3);
        expect(service['gameCards'][0].gameInformation.scoresMultiplayer.length).toEqual(3);
        service.resetHighScores(service['gameCards'][0]);
        expect(service['gameCards'][0].gameInformation.scoresSolo.length).toEqual(0);
        expect(service['gameCards'][0].gameInformation.scoresMultiplayer.length).toEqual(0);
    });

    it('resetAllHighScores should reset the scores for every game', () => {
        for (const card of service['gameCards']) {
            expect(card.gameInformation.scoresSolo.length).toEqual(3);
            expect(card.gameInformation.scoresMultiplayer.length).toEqual(3);
            service.resetHighScores(card);
        }

        for (const card of service['gameCards']) {
            expect(card.gameInformation.scoresSolo.length).toEqual(0);
            expect(card.gameInformation.scoresMultiplayer.length).toEqual(0);
        }
    });
});
