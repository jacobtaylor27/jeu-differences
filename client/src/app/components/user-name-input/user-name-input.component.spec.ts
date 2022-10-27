import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminCommandsComponent } from '@app/components/admin-commands/admin-commands.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

import { UserNameInputComponent } from './user-name-input.component';

describe('UserNameInputComponent', () => {
    let component: UserNameInputComponent;
    let fixture: ComponentFixture<UserNameInputComponent>;
    let spySocketCommunication: jasmine.SpyObj<CommunicationSocketService>;
    let spyGameInformationService: jasmine.SpyObj<GameInformationHandlerService>;
    const dialogMock = {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        close: () => {},
    };

    beforeEach(async () => {
        spySocketCommunication = jasmine.createSpyObj('CommunicationSocketService', ['send']);
        spyGameInformationService = jasmine.createSpyObj('GameInformationHandlerService', ['setPlayerName', 'getId']);
        await TestBed.configureTestingModule({
            declarations: [UserNameInputComponent, AdminCommandsComponent],
            imports: [AppMaterialModule, NoopAnimationsModule, FormsModule, RouterTestingModule],
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: dialogMock,
                },
                {
                    provide: GameInformationHandlerService,
                    useValue: spyGameInformationService,
                },
                {
                    provide: CommunicationSocketService,
                    useValue: spySocketCommunication,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(UserNameInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should verify if name is valid', () => {
        component.playerName = 'test';
        expect(component.isValidName()).toBeTrue();

        component.playerName = '  ';
        expect(component.isValidName()).toBeFalse();

        component.playerName = '';
        expect(component.isValidName()).toBeFalse();
    });

    it('should act like click when enter key is pressed', () => {
        const spyClick = spyOn(component, 'onClickContinue');
        component.playerName = 'test';
        const key = { key: 'Enter' } as KeyboardEvent;
        component.onDialogClick(key);
        expect(spyClick).toHaveBeenCalled();
    });

    it('should use socket communication when click', () => {
        component.playerName = 'test';
        component.onClickContinue();
        expect(spySocketCommunication.send).toHaveBeenCalled();
        expect(spyGameInformationService.setPlayerName).toHaveBeenCalled();
    });
});
