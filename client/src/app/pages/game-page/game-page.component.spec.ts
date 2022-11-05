import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ChatBoxComponent } from '@app/components/chat-box/chat-box.component';
import { CluesAreaComponent } from '@app/components/clues-area/clues-area.component';
import { DifferencesAreaComponent } from '@app/components/differences-area/differences-area.component';
import { ExitGameButtonComponent } from '@app/components/exit-game-button/exit-game-button.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { Subject } from 'rxjs';
import { GamePageComponent } from './game-page.component';

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let dialogSpyObj: jasmine.SpyObj<MatDialog>;
    let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;
    let gameInformationHandlerServiceSpy: jasmine.SpyObj<GameInformationHandlerService>;

    beforeEach(async () => {
        dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
        communicationServiceSpy = jasmine.createSpyObj('CommunicationService', ['createGameRoom']);
        gameInformationHandlerServiceSpy = jasmine.createSpyObj(
            'GameInformationHandlerService',
            [
                'getGameMode',
                'getGameName',
                'getPlayer',
                'getOriginalBmp',
                'getOriginalBmpId',
                'getModifiedBmpId',
                'getGameInformation',
                'getId',
                'getOpponent',
                'getNbDifferences',
                'getNbTotalDifferences',
            ],
            { $differenceFound: new Subject<string>() },
        );
        gameInformationHandlerServiceSpy.getPlayer.and.callFake(() => {
            return { name: 'test', nbDifferences: 0 };
        });
        gameInformationHandlerServiceSpy.getOpponent.and.callFake(() => {
            return { name: 'test2', nbDifferences: 0 };
        });
        gameInformationHandlerServiceSpy.getNbDifferences.and.callFake(() => 0);
        gameInformationHandlerServiceSpy.getNbTotalDifferences.and.callFake(() => 0);
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
});
