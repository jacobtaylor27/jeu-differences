import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { SocketEvent } from '@common/socket-event';
import { Socket } from 'socket.io-client';
import { TimerStopwatchComponent } from './timer-stopwatch.component';

describe('TimerStopwatchComponent', () => {
    let component: TimerStopwatchComponent;
    let fixture: ComponentFixture<TimerStopwatchComponent>;

    let socketServiceMock: CommunicationSocketService;
    let socketHelper: SocketTestHelper;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new CommunicationSocketService();
        socketServiceMock['socket'] = socketHelper as unknown as Socket;

        await TestBed.configureTestingModule({
            declarations: [TimerStopwatchComponent],
            imports: [AppMaterialModule, RouterTestingModule, HttpClientModule],
            providers: [{ provide: CommunicationSocketService, useValue: socketServiceMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(TimerStopwatchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should set the display time', () => {
        socketHelper.peerSideEmit(SocketEvent.Clock, '2');
        component.ngOnInit();
        expect(component.timerDisplay).toBe('00:02');
    });
});
