import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameCardComponent } from '@app/components/game-card/game-card.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameInfo } from '@common/game-info';
import { of } from 'rxjs';
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

    it('should fetch game information on init', () => {
        const spyFetch = spyOn(component, 'fetchGameInformation');
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
            return of({ body: { games: [{}] } } as HttpResponse<{ games: GameInfo[] }>);
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
});
