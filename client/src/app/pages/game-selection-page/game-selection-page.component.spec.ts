import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';
import { GameSelectionPageComponent } from './game-selection-page.component';

describe('GameSelectionPageComponent', () => {
    let component: GameSelectionPageComponent;
    let fixture: ComponentFixture<GameSelectionPageComponent>;
    let spyGameCarouselService: jasmine.SpyObj<GameCarouselService>;

    beforeEach(async () => {
        spyGameCarouselService = jasmine.createSpyObj('GameCarouselService', ['setCardMode', 'getCards', 'getCarouselLength', 'hasCards']);
        await TestBed.configureTestingModule({
            declarations: [GameSelectionPageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [AppMaterialModule],
            providers: [
                {
                    provide: GameCarouselService,
                    useValue: spyGameCarouselService,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameSelectionPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('formatScoreTime should call getMMSSFormat from timerFormatter class', () => {
        expect(component.formatScoreTime(1)).toEqual('00:01');
    });
});
