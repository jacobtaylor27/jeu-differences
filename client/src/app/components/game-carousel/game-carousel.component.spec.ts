import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameCardComponent } from '@app/components/game-card/game-card.component';
import { CarouselResponse } from '@app/interfaces/carousel-response';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { CarouselInformation } from '@common/carousel-information';
import { PublicGameInformation } from '@common/game-information';
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
            'hasMoreThanOneCard',
            'getNumberOfCards',
            'setCarouselInformation',
        ]);
        spyCommunicationService = jasmine.createSpyObj('CommunicationService', ['getAllGameInfos', 'getGamesInfoByPage']);
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

        spyGameCarouselService.carouselInformation = {
            currentPage: 1,
            gamesOnPage: 1,
            nbOfPages: 1,
            nbOfGames: 1,
            hasNext: true,
            hasPrevious: false,
        };
        spyCommunicationService.getGamesInfoByPage.and.callFake(() => {
            return of({ body: { carouselInfo: {}, games: [{}] } } as HttpResponse<CarouselResponse>);
        });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get the first page', () => {
        component.getFirstPage();
        expect(spyCommunicationService.getGamesInfoByPage).toHaveBeenCalled();
    });

    it('should get first page on init', () => {
        component.ngOnInit();
        expect(spyCommunicationService.getGamesInfoByPage).toHaveBeenCalled();
    });

    it('should get the next page', () => {
        component.getNextPage();
        expect(spyCommunicationService.getGamesInfoByPage).toHaveBeenCalled();
    });

    it('should get the previous page', () => {
        component.getPreviousPage();
        expect(spyCommunicationService.getGamesInfoByPage).toHaveBeenCalled();
    });

    it('should return if the carousel has cards', () => {
        component.hasCards();
        expect(spyGameCarouselService.hasCards).toHaveBeenCalled();
    });

    it('should set the game cards array', () => {
        component.setGameCards([]);
        expect(component.games.length).toEqual(0);
        component.setGameCards([{} as PublicGameInformation]);
        expect(component.games.length).toEqual(1);
    });

    it('should set the carousel information attribute', () => {
        component.setCarouselInformation({} as CarouselInformation);
        expect(spyGameCarouselService.setCarouselInformation).toHaveBeenCalled();
    });

    it('should return if the information is loaded', () => {
        component.isInformationLoaded();
        expect(component.isLoaded).toBeFalsy();
        component.isLoaded = true;
        expect(component.isLoaded).toBeTruthy();
    });

    it('getPage should fetch the games properly', () => {
        component.getPage(1);
        expect(spyCommunicationService.getGamesInfoByPage).toHaveBeenCalled();
    });

    it('onClickPrevious should call method get previous page', () => {
        component.onClickPrevious();
        expect(spyCommunicationService.getGamesInfoByPage).toHaveBeenCalled();
    });

    it('onClickNext should call method getNextPage', () => {
        component.onClickNext();
        expect(spyCommunicationService.getGamesInfoByPage).toHaveBeenCalled();
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
