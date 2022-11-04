/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameCardComponent } from '@app/components/game-card/game-card.component';
// import { CarouselResponse } from '@app/interfaces/carousel-response';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';
import { CommunicationService } from '@app/services/communication/communication.service';
// import { PublicGameInformation } from '@common/game-information';
// import { of } from 'rxjs';
import { GameCarouselComponent } from './game-carousel.component';

describe('GameCarouselComponent', () => {
    let component: GameCarouselComponent;
    let fixture: ComponentFixture<GameCarouselComponent>;
    let spyGameCarouselService: GameCarouselService;
    let spyCommunicationService: jasmine.SpyObj<CommunicationService>;

    beforeEach(async () => {
        spyGameCarouselService = jasmine.createSpyObj('GameCarouselService', [
            'getCards',
            'resetRange',
            'showPreviousFour',
            'showNextFour',
            'hasPreviousCards',
            'hasNextCards',
            'hasCards',
            'setCards',
            'hasMoreThanOneCard',
            'getNumberOfCards',
        ]);
        spyCommunicationService = jasmine.createSpyObj('CommunicationService', ['getAllGameInfos']);
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule, HttpClientModule],
            declarations: [GameCarouselComponent, GameCardComponent],
            providers: [
                {
                    provide: GameCarouselService,
                    useValue: spyGameCarouselService,
                },
                {
                    provide: CommunicationService,
                    useValue: spyCommunicationService,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameCarouselComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch game information on init', () => {});

    it('should return if the carousel has cards', () => {
        component.hasCards();
        expect(spyGameCarouselService.hasCards).toHaveBeenCalled();
    });

    it('fetchGameInformation should fetch the games properly', () => {});

    it('resetStartingRange should call resetRange from the gameCarouselService', () => {});

    it('onClickPrevious should call method showPreviousFour from gameCarouselService', () => {});

    it('onClickNext should call method showNextFour from gameCarouselService', () => {});

    it('hasCardsBefore should call method hasPreviousCards from gameCarouselService', () => {
        expect(component.hasCardsBefore()).toBeFalsy();
        expect(spyGameCarouselService.hasPreviousCards).toHaveBeenCalled();
    });

    it('hasCardsAfter should call method hasNextCards from gameCarouselService', () => {
        expect(component.hasCardsAfter()).toBeFalsy();
        expect(spyGameCarouselService.hasNextCards).toHaveBeenCalled();
    });

    it('should get the number of game cards', () => {
        component.getCardsCount();
        expect(spyGameCarouselService.getNumberOfCards).toHaveBeenCalled();
    });

    it('should return true if there are more than one card', () => {
        component.hasMoreThanOneCard();
        expect(spyGameCarouselService.hasMoreThanOneCard).toHaveBeenCalled();
    });
});
