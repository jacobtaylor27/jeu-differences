import { TestBed } from '@angular/core/testing';
import { GameSelectionService } from './game-selection.service';

describe('GameSelectionService', () => {
    let service: GameSelectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameSelectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('hasPreviousCards should verify if there are cards before those that are shown', () => {
        expect(service.hasPreviousCards()).toBeFalsy();
        service.showNextFour();
        expect(service.hasPreviousCards()).toBeTruthy();
    });

    it('hasNextCards should verify if there are cards after those that are shown', () => {
        expect(service.hasNextCards()).toBeTruthy();
        service.showNextFour();
        service.showNextFour();
        expect(service.hasNextCards()).toBeFalsy();
    });

    it('initialiseGameCard should initialise the attribute gameCards', () => {
        const DEFAULT_NB_CARDS = 11;
        const INDEX_OF_FIRST_CARD = 0;
        expect(service.gameCards.length).toEqual(DEFAULT_NB_CARDS);
        expect(service.gameCards[INDEX_OF_FIRST_CARD].gameName).toEqual('Game Name 0');
        expect(service.gameCards[INDEX_OF_FIRST_CARD].imgSource).toEqual('https://picsum.photos/500');
        expect(service.gameCards[INDEX_OF_FIRST_CARD].scoresSolo.length).toEqual(3);
        expect(service.gameCards[INDEX_OF_FIRST_CARD].scoresMultiplayer.length).toEqual(3);
    });

    it('setActiveCards should make 4 cards of the list active', () => {
        const DEFAULT_ACTIVE_CARDS = 4;
        let activeCards = service.gameCards.filter((card) => card.isShown);
        expect(activeCards.length).toEqual(DEFAULT_ACTIVE_CARDS);

        const beginRange = 4;
        const endRange = 7;
        service.setActiveCards(beginRange, endRange);
        activeCards = service.gameCards.filter((card) => card.isShown);
        expect(activeCards.length).toEqual(DEFAULT_ACTIVE_CARDS);
    });

    it('hideAllCards should make all cards hidden', () => {
        const DEFAULT_NB_CARDS = 11;
        service.hideAllCards();
        const hiddenCards = service.gameCards.filter((card) => card.isShown === false);
        expect(hiddenCards.length).toEqual(DEFAULT_NB_CARDS);
    });

    it('getActiveCards should return an array with all the active cards', () => {
        let cards = service.getActiveCards();
        const DEFAULT_NB_CARDS = 4;
        expect(cards.length).toEqual(DEFAULT_NB_CARDS);

        service.hideAllCards();
        cards = service.getActiveCards();
        expect(cards.length).toEqual(0);
    });

    it('increaseActiveRange should increase starting and ending range by 4', () => {
        service.increaseActiveRange();
        const beginRange = 4;
        const endRange = 7;
        expect(service.activeCardsRange.start).toEqual(beginRange);
        expect(service.activeCardsRange.end).toEqual(endRange);
    });

    it('decreaseActiveRange should decrease starting and ending range by 4', () => {
        service.activeCardsRange.start = 10;
        service.activeCardsRange.end = 13;
        service.decreaseActiveRange();

        const beginRange = 6;
        const endRange = 9;
        expect(service.activeCardsRange.start).toEqual(beginRange);
        expect(service.activeCardsRange.end).toEqual(endRange);
    });

    it('showNextFour should show next 4 cards', () => {
        service.showNextFour();
        expect(service.gameCards.findIndex((card) => card.isShown)).toEqual(4);
        expect(service.gameCards[7].isShown).toBeTruthy();
    });

    it('showPreviousFour should show previous 4 cards', () => {
        service.activeCardsRange.start = 8;
        service.activeCardsRange.end = 11;
        service.showPreviousFour();
        expect(service.gameCards.findIndex((card) => card.isShown)).toEqual(4);
        expect(service.gameCards[7].isShown).toBeTruthy();
    });
});
