import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { AdminCommandsComponent } from '@app/components/admin-commands/admin-commands.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

import { UserNameInputComponent } from './user-name-input.component';

describe('UserNameInputComponent', () => {
    let component: UserNameInputComponent;
    let fixture: ComponentFixture<UserNameInputComponent>;
    let spyRouter: jasmine.SpyObj<Router>;
    let spyGameInformationHandlerService: jasmine.SpyObj<GameInformationHandlerService>;

    beforeEach(async () => {
        spyRouter = jasmine.createSpyObj('Router', ['navigate']);
        spyGameInformationHandlerService = jasmine.createSpyObj('GameInformationHandlerService', ['setPlayerName']);
        await TestBed.configureTestingModule({
            declarations: [UserNameInputComponent, AdminCommandsComponent],
            imports: [AppMaterialModule, NoopAnimationsModule, FormsModule],
            providers: [
                {
                    provide: Router,
                    useValue: jasmine.createSpyObj('Router', ['navigate']),
                },
                {
                    provide: GameInformationHandlerService,
                    useValue: jasmine.createSpyObj('GameInformationHandlerService', ['setPlayerName']),
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

    it('should redirect on game page on continue click', () => {
        component.playerName = 'test';
        component.onClickContinue();
        expect(spyRouter.navigate).toHaveBeenCalledWith(['/game']);
        expect(spyGameInformationHandlerService.setPlayerName).toHaveBeenCalled();

        component.playerName = '';
        component.onClickContinue();
        expect(spyRouter.navigate).not.toHaveBeenCalledWith(['/game']);
        expect(spyGameInformationHandlerService.setPlayerName).not.toHaveBeenCalled();
    });
});
