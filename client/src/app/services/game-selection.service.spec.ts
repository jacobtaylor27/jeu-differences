import { TestBed } from '@angular/core/testing';
import { GameSelectionService } from './game-selection.service';

describe('GameSelectionService', () => {
    let gameSelectionService: GameSelectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        gameSelectionService = new GameSelectionService();
    });

    it('should be created', () => {
        expect(gameSelectionService).toBeTruthy();
    });

    it('hasPreviousCards should verify if there are cards before those that are shown', () => {
        expect(gameSelectionService.hasPreviousCards()).toBeFalsy();
        gameSelectionService.showNextFour();
        expect(gameSelectionService.hasPreviousCards()).toBeTruthy();
    });

    it('hasNextCards should verify if there are cards after those that are shown', () => {
        expect(gameSelectionService.hasNextCards()).toBeTruthy();
        gameSelectionService.showNextFour();
        gameSelectionService.showNextFour();
        expect(gameSelectionService.hasNextCards()).toBeFalsy();
    });

    it('fetchGameCards should retrieve cards and fill gameCards attributes', () => {
        expect(gameSelectionService.gameCards.length).toEqual(11);
        expect(gameSelectionService.gameCards[0].gameName).toEqual('Game Name 1');
        expect(gameSelectionService.gameCards[0].imgSource).toEqual('https://picsum.photos/500');
        expect(gameSelectionService.gameCards[0].scoresSolo.length).toEqual(3);
        expect(gameSelectionService.gameCards[0].scoresMultiplayer.length).toEqual(3);
    });

    it('setActiveCards should make 4 cards of the list active', () => {
        let activeCards = gameSelectionService.gameCards.filter((card) => card.isShown);
        expect(activeCards.length).toEqual(4);

        gameSelectionService.setActiveCards(4, 7);
        activeCards = gameSelectionService.gameCards.filter((card) => card.isShown);
        expect(activeCards.length).toEqual(4);
    });

    it('hideAllCards should make all cards hidden', () => {
        gameSelectionService.hideAllCards();
        const hiddenCards = gameSelectionService.gameCards.filter((card) => card.isShown === false);
        expect(hiddenCards.length).toEqual(11);
    });

    it('getActiveCards should return an array with all the active cards', () => {
        let cards = gameSelectionService.getActiveCards();
        expect(cards.length).toEqual(4);

        gameSelectionService.hideAllCards();
        cards = gameSelectionService.getActiveCards();
        expect(cards.length).toEqual(0);
    });

    it('increaseActiveRange should increase starting and ending range by 4', () => {
        gameSelectionService.increaseActiveRange();
        expect(gameSelectionService.activeCardsRange.start).toEqual(4);
        expect(gameSelectionService.activeCardsRange.end).toEqual(7);
    });

    it('decreaseActiveRange should decrease starting and ending range by 4', () => {
        gameSelectionService.activeCardsRange.start = 10;
        gameSelectionService.activeCardsRange.end = 13;
        gameSelectionService.decreaseActiveRange();
        expect(gameSelectionService.activeCardsRange.start).toEqual(6);
        expect(gameSelectionService.activeCardsRange.end).toEqual(9);
    });

    it('showNextFour should show next 4 cards', () => {
        gameSelectionService.showNextFour();
        expect(gameSelectionService.gameCards.findIndex((card) => card.isShown)).toEqual(4);
        expect(gameSelectionService.gameCards[7].isShown).toBeTruthy();
    });

    it('showPreviousFour should show previous 4 cards', () => {
        gameSelectionService.activeCardsRange.start = 8;
        gameSelectionService.activeCardsRange.end = 11;
        gameSelectionService.showPreviousFour();
        expect(gameSelectionService.gameCards.findIndex((card) => card.isShown)).toEqual(4);
        expect(gameSelectionService.gameCards[7].isShown).toBeTruthy();
    });
});
