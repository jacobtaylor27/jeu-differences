import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModule } from '@app/modules/material.module';

import { GameConstantFieldComponent } from './game-constant-field.component';

describe('GameConstantFieldComponent', () => {
    let component: GameConstantFieldComponent;
    let fixture: ComponentFixture<GameConstantFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameConstantFieldComponent],
            imports: [AppMaterialModule],
        }).compileComponents();

        fixture = TestBed.createComponent(GameConstantFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
