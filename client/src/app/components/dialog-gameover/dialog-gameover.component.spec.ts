import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGameOverComponent } from './dialog-gameover.component';

describe('DialogGameoverComponent', () => {
    let component: DialogGameOverComponent;
    let fixture: ComponentFixture<DialogGameOverComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DialogGameOverComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogGameOverComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
