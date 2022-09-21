import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import { Tool } from '@app/enums/tool';
import { Pencil } from '@app/interfaces/pencil';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { Subject } from 'rxjs';

import { ToolBoxComponent } from './tool-box.component';

describe('ToolBoxComponent', () => {
    let component: ToolBoxComponent;
    let fixture: ComponentFixture<ToolBoxComponent>;
    let toolBoxServiceSpyObj: jasmine.SpyObj<ToolBoxService>;
    let dialogSpyObj: jasmine.SpyObj<MatDialog>;
    beforeEach(async () => {
        dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
        toolBoxServiceSpyObj = jasmine.createSpyObj('ToolBoxService', [], { $pencil: new Subject() });
        await TestBed.configureTestingModule({
            declarations: [ToolBoxComponent],
            providers: [
                { provide: ToolBoxService, useValue: toolBoxServiceSpyObj },
                { provide: MatDialog, useValue: dialogSpyObj },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ToolBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should change the state of pencil', async () => {
        const expectedTool: Tool = Tool.Pencil;
        toolBoxServiceSpyObj.$pencil.subscribe((newPencil: Pencil) => {
            expect(newPencil).toEqual(component.pencil);
        });
        component.changePencilState(expectedTool);
        expect(component.pencil.state).toEqual(expectedTool);
    });

    it('should change the color of the pencil', async () => {
        const expectedColor = 'test';
        toolBoxServiceSpyObj.$pencil.subscribe((newPencil: Pencil) => {
            expect(newPencil).toEqual(component.pencil);
        });
        component.changePencilColor(expectedColor);
        expect(component.pencil.color).toEqual(expectedColor);
    });

    it('should change the width of the pencil', async () => {
        const expectedWidth = 3;
        toolBoxServiceSpyObj.$pencil.subscribe((newPencil: Pencil) => {
            expect(newPencil).toEqual(component.pencil);
        });
        component.changePencilWith({ value: expectedWidth } as MatSliderChange);
        expect(component.pencil.width).toEqual(expectedWidth);
    });

    it('should change the width to 0 if the value is null', () => {
        toolBoxServiceSpyObj.$pencil.subscribe((newPencil: Pencil) => {
            expect(newPencil).toEqual(component.pencil);
        });
        component.changePencilWith({ value: null } as MatSliderChange);
        expect(component.pencil.width).toEqual(0);
    });

    it('should format the value', () => {
        const expectedValue = 3;
        const expectedLabel = expectedValue.toString() + 'px';
        expect(component.formatLabel(expectedValue)).toEqual(expectedLabel);
    });

    it('should return 0 if the value is null', () => {
        expect(component.formatLabel(null)).toEqual(0);
    });

    it('should open a dialog to upload an image', () => {
        component.openUploadDialog();
        expect(dialogSpyObj.open).toHaveBeenCalled();
    });
});
