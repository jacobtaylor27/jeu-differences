import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUploadFormComponent } from './dialog-upload-form.component';

describe('DialogUploadFormComponent', () => {
    let component: DialogUploadFormComponent;
    let fixture: ComponentFixture<DialogUploadFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DialogUploadFormComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogUploadFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
