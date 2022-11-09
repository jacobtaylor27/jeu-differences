import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SIZE } from '@app/constants/canvas';
import { CanvasType } from '@app/enums/canvas-type';
import { Pencil } from '@app/interfaces/pencil';
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
            [
                'reposition',
                'addDrawingCanvas',
                'draw',
                'updateImage',
                'createStroke',
                'resetAllLayers',
                'startDrawing',
                'stopDrawing',
                'clearAllLayers',
                'clearAllBackground',
            ],
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
});
