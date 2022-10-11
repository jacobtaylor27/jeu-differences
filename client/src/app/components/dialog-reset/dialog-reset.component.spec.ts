import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogResetComponent } from '@app/components/dialog-reset/dialog-reset.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { Subject } from 'rxjs';

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
            imports: [AppMaterialModule, BrowserAnimationsModule, ReactiveFormsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogResetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should submit a form and propagate event to reset both image', () => {
        component.isCanvasReset = { draw: true, compare: true };
        const resetDiffSpy = spyOn(toolBoxServiceSpyObj.$resetDiff, 'next');
        const resetSourceSpy = spyOn(toolBoxServiceSpyObj.$resetSource, 'next');
        component.onSubmit();
        expect(resetDiffSpy).toHaveBeenCalled();
        expect(resetSourceSpy).toHaveBeenCalled();
    });

    it('should submit a form and propagate event to reset difference image', () => {
        component.isCanvasReset = { draw: true, compare: false };
        const resetDiffSpy = spyOn(toolBoxServiceSpyObj.$resetDiff, 'next');
        const resetSourceSpy = spyOn(toolBoxServiceSpyObj.$resetSource, 'next');
        component.onSubmit();
        expect(resetDiffSpy).toHaveBeenCalled();
        expect(resetSourceSpy).not.toHaveBeenCalled();
    });

    it('should submit a form and propagate event to reset source image', () => {
        component.isCanvasReset = { draw: false, compare: true };
        const resetDiffSpy = spyOn(toolBoxServiceSpyObj.$resetDiff, 'next');
        const resetSourceSpy = spyOn(toolBoxServiceSpyObj.$resetSource, 'next');
        component.onSubmit();
        expect(resetDiffSpy).not.toHaveBeenCalled();
        expect(resetSourceSpy).toHaveBeenCalled();
    });

    it('should not submit a form and propagate event to reset image if the value is not valid', () => {
        component.isCanvasReset = { draw: false, compare: false };
        const resetDiffSpy = spyOn(toolBoxServiceSpyObj.$resetDiff, 'next');
        const resetSourceSpy = spyOn(toolBoxServiceSpyObj.$resetSource, 'next');
        component.onSubmit();
        expect(resetDiffSpy).not.toHaveBeenCalled();
        expect(resetSourceSpy).not.toHaveBeenCalled();
    });
});
