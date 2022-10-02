import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';
import { GameCardComponent } from '../game-card/game-card.component';
import { GameCarouselComponent } from './game-carousel.component';

describe('GameCarouselComponent', () => {
    let component: GameCarouselComponent;
    let fixture: ComponentFixture<GameCarouselComponent>;
    let spyGameCarouselService: GameCarouselService;

    beforeEach(async () => {
        spyGameCarouselService = jasmine.createSpyObj('GameCarouselService', [
            'getCards',
            'resetRange',
            'showPreviousFour',
            'showNextFour',
            'hasPreviousCards',
            'hasNextCards',
            'hasCards',
        ]);
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [GameCarouselComponent, GameCardComponent],
            providers: [
                {
                    provide: GameCarouselService,
                    useValue: spyGameCarouselService,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameCarouselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
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
