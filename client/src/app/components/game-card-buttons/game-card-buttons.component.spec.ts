import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { gameCard1 } from '@app/constants/game-card-constant.spec';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameCardService } from '@app/services/game-card/game-card.service';
import { RouterService } from '@app/services/router-service/router.service';
import { of } from 'rxjs';
import { GameCardButtonsComponent } from './game-card-buttons.component';

describe('GameCardButtonsComponent', () => {
    let component: GameCardButtonsComponent;
    let fixture: ComponentFixture<GameCardButtonsComponent>;
    let spyGameCardService: jasmine.SpyObj<GameCardService>;
    let spyRouterService: jasmine.SpyObj<RouterService>;

    beforeEach(async () => {
        spyGameCardService = jasmine.createSpyObj('GameCardService', ['openNameDialog', 'deleteGame', 'refreshGame']);
        spyRouterService = jasmine.createSpyObj('RouterService', ['reloadPage']);
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule, RouterTestingModule],
            declarations: [GameCardButtonsComponent],
            providers: [
                HttpHandler,
                HttpClient,
                {
                    provide: GameCardService,
                    useValue: spyGameCardService,
                },
                {
                    provide: RouterService,
                    useValue: spyRouterService,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameCardButtonsComponent);
        component = fixture.componentInstance;
        component.gameCard = gameCard1;
        spyGameCardService.refreshGame.and.returnValue(of(void 0));
        spyGameCardService.deleteGame.and.returnValue(of(void 0));
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onClickPlayGame should call the open name dialog method', () => {
        component.onClickPlayGame();
        expect(spyGameCardService.openNameDialog).toHaveBeenCalled();
    });

    it('should return is multi attribute', () => {
        expect(component.isMultiplayer()).toBeTrue();
    });

    it('should call open name dialog when clicking create or join', () => {
        component.onClickCreateJoinGame();
        expect(spyGameCardService.openNameDialog).toHaveBeenCalled();
    });
});
