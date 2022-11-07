import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { GameCardComponent } from '@app/components/game-card/game-card.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { PublicGameInformation } from '@common/game-information';
import { of } from 'rxjs';
import { LoadingScreenComponent } from '@app/components/loading-screen/loading-screen.component';
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
            imports: [AppMaterialModule, HttpClientModule, BrowserModule, ReactiveFormsModule],
            declarations: [GameCarouselComponent, GameCardComponent, LoadingScreenComponent],
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

    it('should fetch game information on init', () => {
        const spyFetch = spyOn(component, 'fetchGameInformation');
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        spyFetch.and.callFake(() => {});
        component.ngOnInit();
        expect(spyFetch).toHaveBeenCalled();
    });

    it('should return if the carousel has cards', () => {
        component.hasCards();
        expect(spyGameCarouselService.hasCards).toHaveBeenCalled();
    });

    it('fetchGameInformation should fetch the games properly', () => {
        spyCommunicationService.getAllGameInfos.and.callFake(() => {
            return of({ body: { games: [{}] } } as HttpResponse<{ games: PublicGameInformation[] }>);
        });
        component.fetchGameInformation();
        expect(spyCommunicationService.getAllGameInfos).toHaveBeenCalled();

        spyCommunicationService.getAllGameInfos.and.rejectWith(undefined);
        expect(spyCommunicationService.getAllGameInfos).toHaveBeenCalled();
    });

    it('resetStartingRange should call resetRange from the gameCarouselService', () => {
        component.resetStartingRange();
        expect(spyGameCarouselService.resetRange).toHaveBeenCalled();
    });

    it('onClickPrevious should call method showPreviousFour from gameCarouselService', () => {
        component.onClickPrevious();
        expect(spyGameCarouselService.showPreviousFour).toHaveBeenCalled();
    });

    it('onClickNext should call method showNextFour from gameCarouselService', () => {
        component.onClickNext();
        expect(spyGameCarouselService.showNextFour).toHaveBeenCalled();
    });

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
