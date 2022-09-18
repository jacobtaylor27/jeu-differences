import { TestBed } from '@angular/core/testing';
import { Score } from '@app/classes/score';
import { GameCategory } from '@app/enums/game-category';

import { GameSelectionService } from './game-selection.service';

describe('GameSelectionService', () => {
    let service: GameSelectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = new GameSelectionService();
        service.gameInformation = [
            {
                gameName: 'Game Name 1',
                imgSource: 'https://picsum.photos/500',
                scoresSolo: [
                    new Score('Player 1', 620, GameCategory.Solo),
                    new Score('Player 2', 78, GameCategory.Solo),
                    new Score('Player 3', 32, GameCategory.Solo),
                ],
                scoresMultiplayer: [
                    new Score('Player X', 122, GameCategory.Multiplayer),
                    new Score('Player Y', 88, GameCategory.Multiplayer),
                    new Score('Player Z', 54, GameCategory.Multiplayer),
                ],
            },
            {
                gameName: 'Game Name 2',
                imgSource: 'https://picsum.photos/500',
                scoresSolo: [
                    new Score('Player 1', 620, GameCategory.Solo),
                    new Score('Player 2', 78, GameCategory.Solo),
                    new Score('Player 3', 32, GameCategory.Solo),
                ],
                scoresMultiplayer: [
                    new Score('Player X', 122, GameCategory.Multiplayer),
                    new Score('Player Y', 88, GameCategory.Multiplayer),
                    new Score('Player Z', 54, GameCategory.Multiplayer),
                ],
            },
            {
                gameName: 'Game Name 3',
                imgSource: 'https://picsum.photos/500',
                scoresSolo: [
                    new Score('Player 1', 620, GameCategory.Solo),
                    new Score('Player 2', 78, GameCategory.Solo),
                    new Score('Player 3', 32, GameCategory.Solo),
                ],
                scoresMultiplayer: [
                    new Score('Player X', 122, GameCategory.Multiplayer),
                    new Score('Player Y', 88, GameCategory.Multiplayer),
                    new Score('Player Z', 54, GameCategory.Multiplayer),
                ],
            },
            {
                gameName: 'Game Name 4',
                imgSource: 'https://picsum.photos/500',
                scoresSolo: [
                    new Score('Player 1', 620, GameCategory.Solo),
                    new Score('Player 2', 78, GameCategory.Solo),
                    new Score('Player 3', 32, GameCategory.Solo),
                ],
                scoresMultiplayer: [
                    new Score('Player X', 122, GameCategory.Multiplayer),
                    new Score('Player Y', 88, GameCategory.Multiplayer),
                    new Score('Player Z', 54, GameCategory.Multiplayer),
                ],
            },
            {
                gameName: 'Game Name 5',
                imgSource: 'https://picsum.photos/500',
                scoresSolo: [
                    new Score('Player 1', 620, GameCategory.Solo),
                    new Score('Player 2', 78, GameCategory.Solo),
                    new Score('Player 3', 32, GameCategory.Solo),
                ],
                scoresMultiplayer: [
                    new Score('Player X', 122, GameCategory.Multiplayer),
                    new Score('Player Y', 88, GameCategory.Multiplayer),
                    new Score('Player Z', 54, GameCategory.Multiplayer),
                ],
            },
            {
                gameName: 'Game Name 6',
                imgSource: 'https://picsum.photos/500',
                scoresSolo: [
                    new Score('Player 1', 620, GameCategory.Solo),
                    new Score('Player 2', 78, GameCategory.Solo),
                    new Score('Player 3', 32, GameCategory.Solo),
                ],
                scoresMultiplayer: [
                    new Score('Player X', 122, GameCategory.Multiplayer),
                    new Score('Player Y', 88, GameCategory.Multiplayer),
                    new Score('Player Z', 54, GameCategory.Multiplayer),
                ],
            },
            {
                gameName: 'Game Name 7',
                imgSource: 'https://picsum.photos/500',
                scoresSolo: [
                    new Score('Player 1', 620, GameCategory.Solo),
                    new Score('Player 2', 78, GameCategory.Solo),
                    new Score('Player 3', 32, GameCategory.Solo),
                ],
                scoresMultiplayer: [
                    new Score('Player X', 122, GameCategory.Multiplayer),
                    new Score('Player Y', 88, GameCategory.Multiplayer),
                    new Score('Player Z', 54, GameCategory.Multiplayer),
                ],
            },
            {
                gameName: 'Game Name 8',
                imgSource: 'https://picsum.photos/500',
                scoresSolo: [
                    new Score('Player 1', 620, GameCategory.Solo),
                    new Score('Player 2', 78, GameCategory.Solo),
                    new Score('Player 3', 32, GameCategory.Solo),
                ],
                scoresMultiplayer: [
                    new Score('Player X', 122, GameCategory.Multiplayer),
                    new Score('Player Y', 88, GameCategory.Multiplayer),
                    new Score('Player Z', 54, GameCategory.Multiplayer),
                ],
            },
            {
                gameName: 'Game Name 9',
                imgSource: 'https://picsum.photos/500',
                scoresSolo: [
                    new Score('Player 1', 620, GameCategory.Solo),
                    new Score('Player 2', 78, GameCategory.Solo),
                    new Score('Player 3', 32, GameCategory.Solo),
                ],
                scoresMultiplayer: [
                    new Score('Player X', 122, GameCategory.Multiplayer),
                    new Score('Player Y', 88, GameCategory.Multiplayer),
                    new Score('Player Z', 54, GameCategory.Multiplayer),
                ],
            },
            {
                gameName: 'Game Name 10',
                imgSource: 'https://picsum.photos/500',
                scoresSolo: [
                    new Score('Player 1', 620, GameCategory.Solo),
                    new Score('Player 2', 78, GameCategory.Solo),
                    new Score('Player 3', 32, GameCategory.Solo),
                ],
                scoresMultiplayer: [
                    new Score('Player X', 122, GameCategory.Multiplayer),
                    new Score('Player Y', 88, GameCategory.Multiplayer),
                    new Score('Player Z', 54, GameCategory.Multiplayer),
                ],
            },
            {
                gameName: 'Game Name 11',
                imgSource: 'https://picsum.photos/500',
                scoresSolo: [
                    new Score('Player 1', 620, GameCategory.Solo),
                    new Score('Player 2', 78, GameCategory.Solo),
                    new Score('Player 3', 32, GameCategory.Solo),
                ],
                scoresMultiplayer: [
                    new Score('Player X', 122, GameCategory.Multiplayer),
                    new Score('Player Y', 88, GameCategory.Multiplayer),
                    new Score('Player Z', 54, GameCategory.Multiplayer),
                ],
            },
        ];
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

    it('fetchGameCards should retrieve cards and fill gameCards attributes', () => {
        expect(service.gameCards.length).toEqual(11);
        expect(service.gameCards[0].gameName).toEqual('Game Name 1');
        expect(service.gameCards[0].imgSource).toEqual('https://picsum.photos/500');
        expect(service.gameCards[0].scoresSolo.length).toEqual(3);
        expect(service.gameCards[0].scoresMultiplayer.length).toEqual(3);
    });

    it('setActiveCards should make 4 cards of the list active', () => {
        let activeCards = service.gameCards.filter((card) => card.isShown);
        expect(activeCards.length).toEqual(4);

        service.setActiveCards(4, 7);
        activeCards = service.gameCards.filter((card) => card.isShown);
        expect(activeCards.length).toEqual(4);
    });

    it('hideAllCards should make all cards hidden', () => {
        service.hideAllCards();
        const hiddenCards = service.gameCards.filter((card) => card.isShown === false);
        expect(hiddenCards.length).toEqual(11);
    });

    it('getActiveCards should return an array with all the active cards', () => {
        let cards = service.getActiveCards();
        expect(cards.length).toEqual(4);

        service.hideAllCards();
        cards = service.getActiveCards();
        expect(cards.length).toEqual(0);
    });

    it('increaseActiveRange should increase starting and ending range by 4', () => {
        service.increaseActiveRange();
        expect(service.activeCardsRange.start).toEqual(4);
        expect(service.activeCardsRange.end).toEqual(7);
    });

    it('decreaseActiveRange should decrease starting and ending range by 4', () => {
        service.activeCardsRange.start = 10;
        service.activeCardsRange.end = 13;
        service.decreaseActiveRange();
        expect(service.activeCardsRange.start).toEqual(6);
        expect(service.activeCardsRange.end).toEqual(9);
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
