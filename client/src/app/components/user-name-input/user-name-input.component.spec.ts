import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AdminCommandsComponent } from '@app/components/admin-commands/admin-commands.component';
import { AppMaterialModule } from '@app/modules/material.module';

import { UserNameInputComponent } from './user-name-input.component';

describe('UserNameInputComponent', () => {
    let component: UserNameInputComponent;
    let fixture: ComponentFixture<UserNameInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserNameInputComponent, AdminCommandsComponent],
            imports: [AppMaterialModule, NoopAnimationsModule, FormsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(UserNameInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
