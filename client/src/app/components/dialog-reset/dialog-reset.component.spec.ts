import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

import { DialogResetComponent } from '@app/components/dialog-reset/dialog-reset.component';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';

describe('DialogResetComponent', () => {
    let component: DialogResetComponent;
    let fixture: ComponentFixture<DialogResetComponent>;
    let toolBoxServiceSpyObj: jasmine.SpyObj<ToolBoxService>;
    beforeEach(async () => {
        toolBoxServiceSpyObj = jasmine.createSpyObj('ToolBoxService', [], {
            $resetSource: new Subject(),
            $resetDiff: new Subject(),
        });
        await TestBed.configureTestingModule({
            declarations: [DialogResetComponent],
            providers: [{ provide: ToolBoxService, useValue: toolBoxServiceSpyObj }],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogResetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should submit a form and propagate event to reset both image', () => {
        const expectedType = 'both';
        const resetDiffSpy = spyOn(toolBoxServiceSpyObj.$resetDiff, 'next');
        const resetSourceSpy = spyOn(toolBoxServiceSpyObj.$resetSource, 'next');
        spyOn(component.form, 'get').and.returnValue({ value: expectedType } as FormControl);
        component.onSubmit();
        expect(resetDiffSpy).toHaveBeenCalled();
        expect(resetSourceSpy).toHaveBeenCalled();
    });

    it('should submit a form and propagate event to reset difference image', () => {
        const expectedType = 'difference';
        const resetDiffSpy = spyOn(toolBoxServiceSpyObj.$resetDiff, 'next');
        const resetSourceSpy = spyOn(toolBoxServiceSpyObj.$resetSource, 'next');
        spyOn(component.form, 'get').and.returnValue({ value: expectedType } as FormControl);
        component.onSubmit();
        expect(resetDiffSpy).toHaveBeenCalled();
        expect(resetSourceSpy).not.toHaveBeenCalled();
    });

    it('should submit a form and propagate event to reset source image', () => {
        const expectedType = 'source';
        const resetDiffSpy = spyOn(toolBoxServiceSpyObj.$resetDiff, 'next');
        const resetSourceSpy = spyOn(toolBoxServiceSpyObj.$resetSource, 'next');
        spyOn(component.form, 'get').and.returnValue({ value: expectedType } as FormControl);
        component.onSubmit();
        expect(resetDiffSpy).not.toHaveBeenCalled();
        expect(resetSourceSpy).toHaveBeenCalled();
    });

    it('should not submit a form and propagate event to reset image if the value is not valid', () => {
        const expectedType = '';
        const resetDiffSpy = spyOn(toolBoxServiceSpyObj.$resetDiff, 'next');
        const resetSourceSpy = spyOn(toolBoxServiceSpyObj.$resetSource, 'next');
        spyOn(component.form, 'get').and.returnValue({ value: expectedType } as FormControl);
        component.onSubmit();
        expect(resetDiffSpy).not.toHaveBeenCalled();
        expect(resetSourceSpy).not.toHaveBeenCalled();
    });
});
