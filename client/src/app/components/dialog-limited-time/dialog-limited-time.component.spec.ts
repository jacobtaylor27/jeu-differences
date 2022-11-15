import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { GameMode } from '@common/game-mode';

import { DialogLimitedTimeComponent } from './dialog-limited-time.component';

describe('DialogLimitedTimeComponent', () => {
    let component: DialogLimitedTimeComponent;
    let fixture: ComponentFixture<DialogLimitedTimeComponent>;
    let gameInformationHandlerService: jasmine.SpyObj<GameInformationHandlerService>;

    beforeEach(async () => {
        gameInformationHandlerService = jasmine.createSpyObj('GameInformationHandlerService', ['setPlayerName', 'getPlayer', 'handleSocketEvent']);
        gameInformationHandlerService.players = [{ name: '', nbDifferences: 2 }];
        gameInformationHandlerService.gameMode = GameMode.LimitedTime;
        await TestBed.configureTestingModule({
            declarations: [DialogLimitedTimeComponent],
            imports: [AppMaterialModule, RouterTestingModule, BrowserAnimationsModule, ReactiveFormsModule],
            providers: [{ provide: GameInformationHandlerService, useValue: gameInformationHandlerService }],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogLimitedTimeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
