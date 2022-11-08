import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SIZE } from '@app/constants/canvas';
import { CanvasType } from '@app/enums/canvas-type';
import { Command } from '@app/interfaces/command';
import { Line } from '@app/interfaces/line';
import { Pencil } from '@app/interfaces/pencil';
import { Stroke } from '@app/interfaces/stroke';
import { StrokeStyle } from '@app/interfaces/stroke-style';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { Subject } from 'rxjs';

import { DrawCanvasComponent } from './draw-canvas.component';

describe('DrawCanvasComponent', () => {
    let component: DrawCanvasComponent;
    let fixture: ComponentFixture<DrawCanvasComponent>;
    let drawServiceSpyObj: jasmine.SpyObj<DrawService>;
    let toolBoxServiceSpyObj: jasmine.SpyObj<ToolBoxService>;

    beforeEach(async () => {
        drawServiceSpyObj = jasmine.createSpyObj(
            'DrawService',
            ['reposition', 'addDrawingCanvas', 'draw', 'updateImage', 'createStroke', 'resetAllLayers', 'startDrawing', 'stopDrawing'],
            {
                $drawingImage: new Map<CanvasType, Subject<ImageData>>(),
                foregroundContext: new Map<CanvasType, HTMLCanvasElement>(),
            },
        );

        toolBoxServiceSpyObj = jasmine.createSpyObj('ToolBoxService', ['addCanvasType'], {
            $pencil: new Map<CanvasType, Subject<Pencil>>(),
            $uploadImage: new Map<CanvasType, Subject<ImageBitmap>>(),
        });

        await TestBed.configureTestingModule({
            declarations: [DrawCanvasComponent],
            providers: [
                { provide: DrawService, useValue: drawServiceSpyObj },
                { provide: ToolBoxService, useValue: toolBoxServiceSpyObj },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(DrawCanvasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.canvasType = CanvasType.Left;
        toolBoxServiceSpyObj.$pencil.set(component.canvasType, new Subject());
        toolBoxServiceSpyObj.$uploadImage.set(component.canvasType, new Subject());
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get the width of the canvas', () => {
        expect(component.width).toEqual(SIZE.x);
    });

    it('should get the height of the canvas', () => {
        expect(component.height).toEqual(SIZE.y);
    });

    it('start should change the click state and call to reposition the pointer', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        drawServiceSpyObj.startDrawing.and.callFake(() => {});
        component.startDrawing({} as MouseEvent);
        expect(drawServiceSpyObj.startDrawing).toHaveBeenCalled();
    });

    it('should draw when the client is clicking on the canvas', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function, no-unused-vars
        drawServiceSpyObj.draw.and.callFake((event: MouseEvent) => {});
        component.draw({} as MouseEvent);
        expect(drawServiceSpyObj.draw).toHaveBeenCalled();
    });

    // not work for now
    // it('should receive a new pencil', () => {
    //     const expectedPencil = { cap: 'round', width: { pencil: 1, eraser: 2 }, state: Tool.Pencil, color: '#000000' } as Pencil;
    //     toolBoxServiceSpyObj.$pencil.get(component.canvasType)?.subscribe((newPencil: Pencil) => {
    //         expect(component.pencil).toEqual(newPencil);
    //     });
    //     component.ngAfterViewInit();
    //     toolBoxServiceSpyObj.$pencil.get(component.canvasType)?.next(expectedPencil);
    // });

    // not work for now
    // it('should subscribe to get the new image and draw it', async () => {
    //     const ctx = component.background.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    //     // eslint-disable-next-line @typescript-eslint/no-empty-function
    //     drawServiceSpyObj.updateImage.and.callFake(() => {});
    //     // eslint-disable-next-line @typescript-eslint/no-empty-function
    //     spyOn(ctx, 'drawImage').and.callFake(() => {});
    //     toolBoxServiceSpyObj.$uploadImage.get(component.canvasType)?.subscribe(() => {
    //         expect(drawServiceSpyObj.updateImage).toHaveBeenCalled();
    //     });
    //     component.ngAfterViewInit();
    //     toolBoxServiceSpyObj.$uploadImage.get(component.canvasType)?.next({} as ImageBitmap);
    // });

    it('should have the current command to eraser', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        drawServiceSpyObj.stopDrawing.and.callFake(() => {});
        component.stopDrawing();
        expect(drawServiceSpyObj.stopDrawing).toHaveBeenCalled();
    });

    it('should not handle control if it s not shiftKey or control z', () => {
        const spyHandleCtrlShiftZ = spyOn(component, 'handleCtrlShiftZ');
        const spyHandleCtrlZ = spyOn(component, 'handleCtrlZ');
        component.keyEvent({} as KeyboardEvent);
        expect(spyHandleCtrlShiftZ).not.toHaveBeenCalled();
        expect(spyHandleCtrlZ).not.toHaveBeenCalled();
        component.keyEvent({ ctrlKey: true, key: 'a' } as KeyboardEvent);
        expect(spyHandleCtrlShiftZ).not.toHaveBeenCalled();
        expect(spyHandleCtrlZ).not.toHaveBeenCalled();
        component.keyEvent({ ctrlKey: true, key: 'A' } as KeyboardEvent);
        expect(spyHandleCtrlShiftZ).not.toHaveBeenCalled();
        expect(spyHandleCtrlZ).not.toHaveBeenCalled();
    });

    it('should handleCtrlShiftZ if key down', () => {
        const spyHandleCtrlShiftZ = spyOn(component, 'handleCtrlShiftZ');
        const spyHandleCtrlZ = spyOn(component, 'handleCtrlZ');
        component.keyEvent({ ctrlKey: true, key: 'Z', shiftKey: true } as KeyboardEvent);
        expect(spyHandleCtrlShiftZ).toHaveBeenCalled();
        expect(spyHandleCtrlZ).not.toHaveBeenCalled();
    });

    it('should handleCtrlZ if key down', () => {
        const spyHandleCtrlShiftZ = spyOn(component, 'handleCtrlShiftZ');
        const spyHandleCtrlZ = spyOn(component, 'handleCtrlZ');
        component.keyEvent({ ctrlKey: true, key: 'z', shiftKey: false } as KeyboardEvent);
        expect(spyHandleCtrlShiftZ).not.toHaveBeenCalled();
        expect(spyHandleCtrlZ).toHaveBeenCalled();
    });

    it('should handle not handleCtrlShiftZ if the index more then number of commands', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyCommands = spyOn(component, 'executeCommands').and.callFake(() => {});
        component.indexOfCommand = 0;
        component.commands = [];
        component.handleCtrlShiftZ();
        expect(spyCommands).not.toHaveBeenCalled();
    });

    it('should handle handleCtrlShiftZ if the index less then number of commands', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyCommands = spyOn(component, 'executeCommands').and.callFake(() => {});
        component.indexOfCommand = -2;
        component.commands = [];
        component.handleCtrlShiftZ();
        expect(spyCommands).toHaveBeenCalled();
    });

    it('should handle not handleCtrlZ if the index is -1', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyCommands = spyOn(component, 'executeCommands').and.callFake(() => {});
        component.indexOfCommand = -1;
        component.handleCtrlZ();
        expect(spyCommands).not.toHaveBeenCalled();
    });

    it('should handle handleCtrlZ if the index is -1', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyCommands = spyOn(component, 'executeCommands').and.callFake(() => {});
        component.indexOfCommand = 0;
        component.handleCtrlZ();
        expect(spyCommands).toHaveBeenCalled();
    });

    it('should clearForeground and updateImage before and after executeCommands', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyClearForeground = spyOn(component, 'clearForeground').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        component.executeCommands();
        expect(spyClearForeground).toHaveBeenCalled();
    });

    it('should redo commands to the reference of commands', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyClearForeground = spyOn(component, 'clearForeground').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        drawServiceSpyObj.updateImage.and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        drawServiceSpyObj.createStroke.and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        component.commands = [
            { name: 'draw', stroke: { lines: [{} as Line] } as Stroke, style: {} as StrokeStyle } as Command,
            { name: 'erase', stroke: { lines: [{} as Line] } as Stroke, style: {} as StrokeStyle } as Command,
            { name: 'clearForeground', stroke: { lines: [] } as Stroke } as Command,
        ];
        component.indexOfCommand = 2;
        component.executeCommands();
        expect(spyClearForeground).toHaveBeenCalledTimes(2);
        expect(drawServiceSpyObj.createStroke).toHaveBeenCalledTimes(2);
    });
});
