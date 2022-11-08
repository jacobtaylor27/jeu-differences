import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasType } from '@app/enums/canvas-type';
import { Tool } from '@app/enums/tool';
import { Pencil } from '@app/interfaces/pencil';
import { AppMaterialModule } from '@app/modules/material.module';
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
        toolBoxServiceSpyObj = jasmine.createSpyObj('ToolBoxService', ['addCanvasType'], { $pencil: new Map() });
        await TestBed.configureTestingModule({
            declarations: [ToolBoxComponent],
            providers: [
                { provide: ToolBoxService, useValue: toolBoxServiceSpyObj },
                { provide: MatDialog, useValue: dialogSpyObj },
            ],
            imports: [AppMaterialModule, BrowserAnimationsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(ToolBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.canvasType = CanvasType.Left;
        toolBoxServiceSpyObj.$pencil.set(component.canvasType, new Subject());
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should change the state of pencil', async () => {
        const expectedTool: Tool = Tool.Pencil;
        toolBoxServiceSpyObj.$pencil.get(component.canvasType)?.subscribe((newPencil: Pencil) => {
            expect(newPencil).toEqual(component.pencil);
        });
        component.changePencilState(expectedTool);
        expect(component.pencil.state).toEqual(expectedTool);
    });

    it('should change the color of the pencil', async () => {
        const expectedColor = 'test';
        toolBoxServiceSpyObj.$pencil.get(component.canvasType)?.subscribe((newPencil: Pencil) => {
            expect(newPencil).toEqual(component.pencil);
        });
        component.changePencilColor(expectedColor);
        expect(component.pencil.color).toEqual(expectedColor);
    });

    it('should change the width of the pencil', async () => {
        const expectedWidth = 3;
        component.pencil.state = Tool.Pencil;
        toolBoxServiceSpyObj.$pencil.get(component.canvasType)?.subscribe((newPencil: Pencil) => {
            expect(newPencil).toEqual(component.pencil);
        });
        component.changePencilWidth({ value: expectedWidth } as MatSliderChange);
        expect(component.pencil.width.pencil).toEqual(expectedWidth);
    });

    it('should change the width of the eraser', async () => {
        const expectedWidth = 3;
        component.pencil.state = Tool.Eraser;
        toolBoxServiceSpyObj.$pencil.get(component.canvasType)?.subscribe((newPencil: Pencil) => {
            expect(newPencil).toEqual(component.pencil);
        });
        component.changePencilWidth({ value: expectedWidth } as MatSliderChange);
        expect(component.pencil.width.eraser).toEqual(expectedWidth);
    });

    it('should do nothing if the value is null', () => {
        toolBoxServiceSpyObj.$pencil.get(component.canvasType)?.subscribe((newPencil: Pencil) => {
            expect(newPencil).toEqual(component.pencil);
        });
        const spyPencilNext = spyOn(toolBoxServiceSpyObj.$pencil.get(component.canvasType) as Subject<Pencil>, 'next');
        component.changePencilWidth({ value: null } as MatSliderChange);
        expect(spyPencilNext).not.toHaveBeenCalled();
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

    it('should switch the background-color of the pencil and eraser button', () => {
        component.changeButtonColor(Tool.Eraser);
        expect(component.colorButton).toEqual({ pencil: 'primary', eraser: 'accent' });
        component.changeButtonColor(Tool.Pencil);
        expect(component.colorButton).toEqual({ pencil: 'accent', eraser: 'primary' });
    });
});
