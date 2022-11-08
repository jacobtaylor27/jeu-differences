import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { ChatBoxComponent } from '@app/components/chat-box/chat-box.component';
import { CluesAreaComponent } from '@app/components/clues-area/clues-area.component';
import { DifferencesAreaComponent } from '@app/components/differences-area/differences-area.component';
import { ExitGameButtonComponent } from '@app/components/exit-game-button/exit-game-button.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { SocketEvent } from '@common/socket-event';
import { Subject } from 'rxjs';
import { Socket } from 'socket.io-client';
import { GamePageComponent } from './game-page.component';

import { TimerStopwatchComponent } from '@app/components/timer-stopwatch/timer-stopwatch.component';

class SocketClientServiceMock extends CommunicationSocketService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function -- connect needs to be empty (Nikolay's example)
    override connect() {}
}

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let dialogSpyObj: jasmine.SpyObj<MatDialog>;
    let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;
    let gameInformationHandlerServiceSpy: jasmine.SpyObj<GameInformationHandlerService>;
    let socketHelper: SocketTestHelper;
    let socketServiceMock: SocketClientServiceMock;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
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
                TimerStopwatchComponent,
            ],
            imports: [RouterTestingModule, HttpClientModule, AppMaterialModule],
            providers: [
                { provide: MatDialog, useValue: dialogSpyObj },
                { provide: CommunicationService, useValue: communicationServiceSpy },
                { provide: CommunicationSocketService, useValue: socketServiceMock },
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

    it('should open the game over dialog', () => {
        component.openGameOverDialog(false);
        expect(dialogSpyObj.open).toHaveBeenCalled();
        expect(gameInformationHandlerServiceSpy.getOpponent).toHaveBeenCalled();

        component.openGameOverDialog(true);
        expect(dialogSpyObj.open).toHaveBeenCalled();
        expect(gameInformationHandlerServiceSpy.getPlayer).toHaveBeenCalled();
    });

    it('should open the game over dialog with when you win the game', () => {
        const spyOpenGameOverDialog = spyOn(component, 'openGameOverDialog');
        socketHelper.peerSideEmit(SocketEvent.Win);
        expect(spyOpenGameOverDialog).toHaveBeenCalled();
    });

    it('should open the game over dialog with when you lose the game', () => {
        const spyOpenGameOverDialog = spyOn(component, 'openGameOverDialog');
        socketHelper.peerSideEmit(SocketEvent.Lose);
        expect(spyOpenGameOverDialog).toHaveBeenCalled();
    });

    it('should emit LeaveGame when the player quit the page', () => {
        const spyEmit = spyOn(socketHelper, 'emit');
        component.ngOnDestroy();
        expect(spyEmit).toHaveBeenCalled();
    });
});
