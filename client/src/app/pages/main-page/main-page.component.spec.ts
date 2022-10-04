import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { MainPageService } from '@app/services/main-page/main-page.service';

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let spyMainPageService: jasmine.SpyObj<MainPageService>;
    let spyGameInfosHandlerService: jasmine.SpyObj<GameInformationHandlerService>;

    beforeEach(async () => {
        spyMainPageService = jasmine.createSpyObj('GamePageService', ['setGameMode']);
        spyGameInfosHandlerService = jasmine.createSpyObj('GameInformationHandlerService', ['setGameMode', 'getGameName']);

        await TestBed.configureTestingModule({
            declarations: [MainPageComponent],
            imports: [AppMaterialModule],
            providers: [
                {
                    provide: MainPageService,
                    useValue: spyMainPageService,
                },
                {
                    provide: GameInformationHandlerService,
                    useValue: spyGameInfosHandlerService,
                },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should have as title 'Jeu de différences'", () => {
        expect(component.title).toEqual('Jeu de différences');
    });
});
