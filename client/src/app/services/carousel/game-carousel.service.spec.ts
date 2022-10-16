import { TestBed } from '@angular/core/testing';
import { GameCardHandlerService } from '@app/services/game-card-handler/game-card-handler.service';
import { GameCarouselService } from './game-carousel.service';

describe('GameCarouselService', () => {
    let service: GameCarouselService;
    let spyGameCardHandlerService: jasmine.SpyObj<GameCardHandlerService>;

    beforeEach(() => {
        spyGameCardHandlerService = jasmine.createSpyObj<GameCardHandlerService>('GameCardHandlerService', [
            'getGameCards',
            'getNumberOfCards',
            'resetActiveRange',
            'hasCards',
            'getActiveCardsRange',
            'decreaseActiveRange',
            'increaseActiveRange',
            'setActiveCards',
            'hasPreviousCards',
            'hasNextCards',
            'setCardMode',
            'setCards',
            'hasMoreThanOneCard',
        ]);
        TestBed.configureTestingModule({
            providers: [{ provide: GameCardHandlerService, useValue: spyGameCardHandlerService }],
        });
        service = TestBed.inject(GameCarouselService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getCards should return an array of game cards by calling getGameCards', () => {
        service.getCards();
        expect(spyGameCardHandlerService.getGameCards).toHaveBeenCalled();
    });

    it('should call setCards from game card handler service', () => {
        service.setCards([]);
        expect(spyGameCardHandlerService.setCards).toHaveBeenCalled();
    });

    it('getCarouselLength should call getNumberOfCards and return a number', () => {
        service.getCarouselLength();
        expect(spyGameCardHandlerService.getNumberOfCards).toHaveBeenCalled();
    });

    it('resetRange should call resetRange method', () => {
        service.resetRange();
        expect(spyGameCardHandlerService.resetActiveRange).toHaveBeenCalled();
    });

    it('setCardMode should call getGameCards make their isAdmin value to true', () => {
        service.setCardMode(true);
        expect(spyGameCardHandlerService.setCardMode).toHaveBeenCalledOnceWith(true);

        service.setCardMode(false);
        expect(spyGameCardHandlerService.setCardMode).toHaveBeenCalledWith(false);

        service.setCardMode();
        expect(spyGameCardHandlerService.setCardMode).toHaveBeenCalledWith(false);
    });

    it('hasCards should call hasCards from game card handler service', () => {
        service.hasCards();
        expect(spyGameCardHandlerService.hasCards).toHaveBeenCalled();
    });

    it('hasPreviousCards should call getActiveCardsRange', () => {
        service.hasPreviousCards();
        expect(spyGameCardHandlerService.hasPreviousCards).toHaveBeenCalled();
    });

    it('hasNextCards should call getActiveCardsRange', () => {
        service.hasNextCards();
        expect(spyGameCardHandlerService.hasNextCards).toHaveBeenCalled();
    });

    it('showPreviousFour set the range to previous four values', () => {
        service.showPreviousFour();
        expect(spyGameCardHandlerService.decreaseActiveRange).toHaveBeenCalled();
        expect(spyGameCardHandlerService.setActiveCards).toHaveBeenCalled();
    });

    it('showNextFour set the range to next four values', () => {
        service.showNextFour();
        expect(spyGameCardHandlerService.increaseActiveRange).toHaveBeenCalled();
        expect(spyGameCardHandlerService.setActiveCards).toHaveBeenCalled();
    });

    it('should return if there are more than 1 game card', () => {
        service.hasMoreThanOneCard();
        expect(spyGameCardHandlerService.hasMoreThanOneCard).toHaveBeenCalled();
    });
});
