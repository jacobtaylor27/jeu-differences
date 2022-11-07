import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedDialogComponent } from './rejected-dialog.component';

describe('RejectedDialogComponent', () => {
    let component: RejectedDialogComponent;
    let fixture: ComponentFixture<RejectedDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RejectedDialogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(RejectedDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
