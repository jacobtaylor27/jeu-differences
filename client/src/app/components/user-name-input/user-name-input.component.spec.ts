import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminCommandsComponent } from '@app/components/admin-commands/admin-commands.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

import { UserNameInputComponent } from './user-name-input.component';

describe('UserNameInputComponent', () => {
    let component: UserNameInputComponent;
    let fixture: ComponentFixture<UserNameInputComponent>;
    let router: Router;
    // let spyGameInformationHandlerService: jasmine.SpyObj<GameInformationHandlerService>;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const dialogMock = {
        close: () => {},
    };

    beforeEach(async () => {
        // spyGameInformationHandlerService = jasmine.createSpyObj('GameInformationHandlerService', ['setPlayerName']);
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
                    useValue: jasmine.createSpyObj('GameInformationHandlerService', ['setPlayerName']),
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(UserNameInputComponent);
        router = TestBed.inject(Router);
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

    it('should redirect on game page on continue click', () => {
        const spyRouter = spyOn(router, 'navigate');
        component.playerName = 'test';
        component.onClickContinue();
        expect(spyRouter).toHaveBeenCalledWith(['/game']);
    });

    it('should act like click when enter key is pressed', () => {
        const spyRouter = spyOn(router, 'navigate');
        component.playerName = 'test';
        const key = { key: 'Enter' } as KeyboardEvent;
        component.onDialogClick(key);
        expect(spyRouter).toHaveBeenCalledWith(['/game']);
    });
});
