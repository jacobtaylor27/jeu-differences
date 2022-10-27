import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { CluesAreaComponent } from '@app/components/clues-area/clues-area.component';
import { DifferencesAreaComponent } from '@app/components/differences-area/differences-area.component';
import { ExitGameButtonComponent } from '@app/components/exit-game-button/exit-game-button.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { of } from 'rxjs';
import { GamePageComponent } from './game-page.component';
import { ChatBoxComponent } from '@app/components/chat-box/chat-box.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let dialogSpyObj: jasmine.SpyObj<MatDialog>;
    let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;
    let gameInformationHandlerServiceSpy: jasmine.SpyObj<GameInformationHandlerService>;

    beforeEach(async () => {
        dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
        communicationServiceSpy = jasmine.createSpyObj('CommunicationService', ['createGameRoom']);

        gameInformationHandlerServiceSpy = jasmine.createSpyObj('GameInformationHandlerService', [
            'getGameMode',
            'getGameName',
            'getPlayerName',
            'getOriginalBmp',
            'getOriginalBmpId',
            'getModifiedBmpId',
            'getGameInformation',
            'getId',
        ]);

        await TestBed.configureTestingModule({
            declarations: [
                GamePageComponent,
                SidebarComponent,
                PlayAreaComponent,
                CluesAreaComponent,
                DifferencesAreaComponent,
                ExitGameButtonComponent,
                PageHeaderComponent,
                ChatBoxComponent,
            ],
            imports: [RouterTestingModule, HttpClientModule, AppMaterialModule],
            providers: [
                { provide: MatDialog, useValue: dialogSpyObj },
                { provide: CommunicationService, useValue: communicationServiceSpy },

                {
                    provide: GameInformationHandlerService,
                    useValue: gameInformationHandlerServiceSpy,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create game room on init', () => {
        const spyCreateGame = spyOn(component, 'createGameRoom');
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        spyCreateGame.and.callFake(() => {});
        component.ngOnInit();
        expect(spyCreateGame).toHaveBeenCalled();
    });

    it('should createGameRoom properly', () => {
        communicationServiceSpy.createGameRoom.and.callFake(() => {
            return of({} as HttpResponse<{ id: string }>);
        });
        component.createGameRoom();
        expect(component.gameId).toBeUndefined();
        expect(communicationServiceSpy.createGameRoom).toHaveBeenCalled();

        communicationServiceSpy.createGameRoom.and.callFake(() => {
            return of({ body: { id: '1' } } as HttpResponse<{ id: string }>);
        });
        component.createGameRoom();
        expect(communicationServiceSpy.createGameRoom).toHaveBeenCalled();
    });
});
