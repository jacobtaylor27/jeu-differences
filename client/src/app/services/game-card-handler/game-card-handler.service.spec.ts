/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { GameCard } from '@app/interfaces/game-card';
import { GameCardHandlerService } from './game-card-handler.service';

describe('GameCardHandlerService', () => {
    let service: GameCardHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameCardHandlerService);
        service['gameCards'] = [
            {
                gameInformation: {
                    id: '1',
                    name: 'test',
                    thumbnail: 'image',
                    idOriginalBmp: 'imageName',
                    idEditedBmp: '1',
                    soloScore: [
                        {
                            playerName: 'test2',
                            time: 10,
                        },
                        {
                            playerName: 'test',
                            time: 10,
                        },
                    ],
                    multiplayerScore: [
                        {
                            playerName: 'test2',
                            time: 10,
                        },
                        {
                            playerName: 'test',
                            time: 10,
                        },
                    ],
                    nbDifferences: 1,
                    isMulti: true,
                },
                isShown: true,
                isAdminCard: true,
                isMulti: true,
            },
        ];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getGameCards should return the cards array', () => {
        const returnValue = service.getGameCards();
        expect(returnValue).toBeDefined();
        expect(returnValue).toBeInstanceOf(Array);
    });

    it('should set the cards', () => {
        const cards: GameCard[] = [];
        service.setCards(cards);
        expect(service['gameCards']).toEqual(cards);
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
        expect(returnValue.length).toEqual(1);
        expect(returnValue).toBeDefined();
        expect(returnValue).toBeInstanceOf(Array);
        expect(returnValue.length).toBeGreaterThan(0);

        service['gameCards'][0].isShown = false;
        returnValue = service.getActiveCards();
        expect(returnValue.length).toEqual(0);
    });

    it('setActiveCards should set active card from range parameter', () => {
        expect(service['gameCards'][0].isShown).toBeTruthy();
    });

    it('resetActiveRange should set to default value of 0 and 3', () => {
        service.setActiveCards({ start: 10, end: 14 });
        service.resetActiveRange();
        expect(service['activeCardsRange']).toEqual({ start: 0, end: 3 });
    });

    it('resetHighScores should reset scores for a given game', () => {
        expect(service['gameCards'][0].gameInformation.soloScore.length).toEqual(2);
        expect(service['gameCards'][0].gameInformation.multiplayerScore.length).toEqual(2);
        service.resetHighScores(service['gameCards'][0]);
        expect(service['gameCards'][0].gameInformation.soloScore.length).toEqual(0);
        expect(service['gameCards'][0].gameInformation.multiplayerScore.length).toEqual(0);
    });

    it('resetAllHighScores should reset the scores for every game', () => {
        for (const card of service['gameCards']) {
            expect(card.gameInformation.soloScore.length).toEqual(2);
            expect(card.gameInformation.multiplayerScore.length).toEqual(2);
        }
        service.resetAllHighScores();
        for (const card of service['gameCards']) {
            expect(card.gameInformation.soloScore.length).toEqual(0);
            expect(card.gameInformation.multiplayerScore.length).toEqual(0);
        }
    });

    it('setCardMode should make all the cards admin or not', () => {
        service.setCardMode(true);
        for (const card of service['gameCards']) {
            expect(card.isAdminCard).toBeTruthy();
        }

        service.setCardMode(false);
        for (const card of service['gameCards']) {
            expect(card.isAdminCard).toBeFalsy();
        }

        service.setCardMode();
        for (const card of service['gameCards']) {
            expect(card.isAdminCard).toBeFalsy();
        }
    });

    it('hasNextCards should return true if there are cards after the active ones', () => {
        expect(service.hasNextCards()).toBeFalsy();
        service['activeCardsRange'] = { start: 14, end: 17 };
        expect(service.hasNextCards()).toBeFalsy();
    });

    it('hasPreviousCards should return true if there are cards before the active ones', () => {
        expect(service.hasPreviousCards()).toBeFalsy();
        service['activeCardsRange'] = { start: 14, end: 17 };
        expect(service.hasPreviousCards()).toBeTruthy();
    });

    it('should return true if there are more than one game cards', () => {
        expect(service.hasMoreThanOneCard()).toBeFalsy();
        service['gameCards'].push({} as GameCard);
        expect(service.hasMoreThanOneCard()).toBeTruthy();
    });
});
