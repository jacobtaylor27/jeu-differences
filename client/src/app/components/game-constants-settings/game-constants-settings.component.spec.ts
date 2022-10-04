import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameConstantFieldComponent } from '@app/components/game-constant-field/game-constant-field.component';
import { AppMaterialModule } from '@app/modules/material.module';

import { GameConstantsSettingsComponent } from './game-constants-settings.component';

describe('GameConstantsSettingsComponent', () => {
    let component: GameConstantsSettingsComponent;
    let fixture: ComponentFixture<GameConstantsSettingsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameConstantsSettingsComponent, GameConstantFieldComponent],
            imports: [AppMaterialModule],
        }).compileComponents();

        fixture = TestBed.createComponent(GameConstantsSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});