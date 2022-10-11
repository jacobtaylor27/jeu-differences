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
        ]);
        // spyCommunicationService = jasmine.createSpyObj('CommunicationService', ['getAllGameInfos']);
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [GameCarouselComponent, GameCardComponent],
            providers: [
                {
                    provide: GameCarouselService,
                    useValue: spyGameCarouselService,
                },
                // {
                //     provide: CommunicationService,
                //     useValue: spyCommunicationService,
                // },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameCarouselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    //     it('resetStartingRange should call resetRange from the gameCarouselService', () => {
    //         // component.resetStartingRange();
    //         // expect(spyGameCarouselService.resetRange).toHaveBeenCalled();
    //     });

    //     it('onClickPrevious should call method showPreviousFour from gameCarouselService', () => {
    //         // component.onClickPrevious();
    //         // expect(spyGameCarouselService.showPreviousFour).toHaveBeenCalled();
    //     });

    //     it('onClickNext should call method showNextFour from gameCarouselService', () => {
    //         // component.onClickNext();
    //         // expect(spyGameCarouselService.showNextFour).toHaveBeenCalled();
    //     });

    //     it('hasCardsBefore should call method hasPreviousCards from gameCarouselService', () => {
    //         // expect(component.hasCardsBefore()).toBeFalsy();
    //         // expect(spyGameCarouselService.hasPreviousCards).toHaveBeenCalled();
    //     });

    //     it('hasCardsAfter should call method hasNextCards from gameCarouselService', () => {
    //         // expect(component.hasCardsAfter()).toBeFalsy();
    //         // expect(spyGameCarouselService.hasNextCards).toHaveBeenCalled();
    //     });
});
