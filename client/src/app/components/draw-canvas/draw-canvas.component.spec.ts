import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DEFAULT_PENCIL, DEFAULT_POSITION_MOUSE_CLIENT, SIZE } from '@app/constants/canvas';
import { Tool } from '@app/enums/tool';
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
        drawServiceSpyObj = jasmine.createSpyObj('DrawService', ['reposition'], { $differenceImage: new Subject() });
        toolBoxServiceSpyObj = jasmine.createSpyObj('ToolBoxService', [], {
            $pencil: new Subject(),
            $uploadImageInDiff: new Subject(),
            $resetDiff: new Subject(),
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
        drawServiceSpyObj.reposition.and.returnValue({ x: 0, y: 0 });
        component.isClick = false;
        component.startDrawing({} as MouseEvent);
        expect(component.isClick).toBeTrue();
        expect(drawServiceSpyObj.reposition).toHaveBeenCalled();
        component.isClick = false;
        component.startDrawing({} as MouseEvent);
        expect(component.isClick).toBeTrue();
    });
    it('should stop to draw in the canvas', () => {
        component.isClick = true;
        component.stopDrawing();
        expect(component.isClick).toBeFalse();
        component.isClick = false;
        component.stopDrawing();
        expect(component.isClick).toBeFalse();
    });

    it('should draw when the client is clicking on the canvas', () => {
        component.isClick = false;
        component.pencil = DEFAULT_PENCIL;
        component.pencil.state = Tool.Pencil;
        component.coordDraw = DEFAULT_POSITION_MOUSE_CLIENT;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const drawPointSpy = spyOn(component, 'drawPoint').and.callFake(async () => {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            return new Promise<void>(() => {});
        });
        component.draw({} as MouseEvent);
        expect(drawPointSpy).not.toHaveBeenCalled();
        component.isClick = true;
        component.draw({} as MouseEvent);
        expect(drawPointSpy).toHaveBeenCalled();
    });
    it('drawPoint should set the style of the pencil and create the point', () => {
        component.coordDraw = { x: 0, y: 0 };
        component.canvas = { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>;
        component.pencil = { width: { pencil: 5, eraser: 0 }, cap: 'round', color: '#000000', state: Tool.Pencil };
        drawServiceSpyObj.reposition.and.returnValue({ x: 0, y: 0 });
        const ctx = component.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const beginPathSpy = spyOn(ctx, 'beginPath');
        const moveToSpy = spyOn(ctx, 'moveTo');
        const lineToSpy = spyOn(ctx, 'lineTo');
        const stokeSpy = spyOn(ctx, 'stroke');
        component.drawPoint({} as MouseEvent, Tool.Pencil);
        expect(beginPathSpy).toHaveBeenCalled();
        expect(moveToSpy).toHaveBeenCalled();
        expect(lineToSpy).toHaveBeenCalled();
        expect(stokeSpy).toHaveBeenCalled();
        expect(drawServiceSpyObj.reposition).toHaveBeenCalled();
        expect(ctx.lineWidth).toEqual(component.pencil.width.pencil);
        expect(ctx.lineCap).toEqual(component.pencil.cap);
        expect(ctx.strokeStyle).toEqual(component.pencil.color);
    });

    it('should not erase if the client is clicking and select the eraser', () => {
        component.pencil.state = Tool.Eraser;
        const expectedEvent = {} as MouseEvent;
        component.isClick = true;
        const drawSpy = spyOn(component, 'drawPoint');
        component.draw(expectedEvent);
        expect(drawSpy).toHaveBeenCalledWith(expectedEvent, Tool.Eraser);
    });

    it('should erase a point', () => {
        component.coordDraw = { x: 0, y: 0 };
        component.canvas = { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>;
        component.pencil = { width: { pencil: 5, eraser: 2 }, cap: 'round', color: '#000000', state: Tool.Pencil };
        drawServiceSpyObj.reposition.and.returnValue({ x: 0, y: 0 });
        const expectedWhite = '#ffffff';
        const ctx = component.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const beginPathSpy = spyOn(ctx, 'beginPath');
        const moveToSpy = spyOn(ctx, 'moveTo');
        const lineToSpy = spyOn(ctx, 'lineTo');
        const stokeSpy = spyOn(ctx, 'stroke');
        component.drawPoint({} as MouseEvent, Tool.Eraser);
        expect(beginPathSpy).toHaveBeenCalled();
        expect(moveToSpy).toHaveBeenCalled();
        expect(lineToSpy).toHaveBeenCalled();
        expect(stokeSpy).toHaveBeenCalled();
        expect(drawServiceSpyObj.reposition).toHaveBeenCalled();
        expect(ctx.lineWidth).toEqual(component.pencil.width.eraser);
        expect(ctx.lineCap).toEqual(component.pencil.cap);
        expect(ctx.strokeStyle).toEqual(expectedWhite);
    });

    it('should receive a new pencil', () => {
        const expectedPencil = { cap: 'round', width: { pencil: 3, eraser: 3 }, state: Tool.Eraser, color: '#000100' } as Pencil;
        toolBoxServiceSpyObj.$pencil.next(expectedPencil);
        expect(component.pencil).toEqual(expectedPencil);
    });

    it('should subscribe to get the new image and draw it', async () => {
        const ctx = component.img.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const resetCanvasSpy = spyOn(component, 'resetCanvas').and.callFake(() => {});
        const drawImageSpy = spyOn(ctx, 'drawImage');
        toolBoxServiceSpyObj.$uploadImageInDiff.subscribe(() => {
            expect(drawImageSpy).toHaveBeenCalled();
        });
        toolBoxServiceSpyObj.$resetDiff.subscribe(() => {
            expect(resetCanvasSpy).toHaveBeenCalled();
        });
        // component.ngAfterViewInit();
        toolBoxServiceSpyObj.$uploadImageInDiff.next({} as ImageBitmap);
        toolBoxServiceSpyObj.$resetDiff.next();
    });

    it('should subscribe to get the new image and draw it', async () => {
        const ctx = component.img.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const spyDrawImage = spyOn(ctx, 'drawImage');
        toolBoxServiceSpyObj.$uploadImageInDiff.subscribe(() => {
            expect(spyDrawImage).toHaveBeenCalled();
        });
        component.ngAfterViewInit();
        toolBoxServiceSpyObj.$uploadImageInDiff.next({} as ImageBitmap);
    });

    it('should stop if the mouseup when initialize state of the canvas', () => {
        const spyStop = spyOn(component, 'stop');
        component.enterCanvas({ buttons: 0 } as MouseEvent);
        expect(spyStop).toHaveBeenCalled();
    });

    it('should start to draw if the mousedown when initialize state of the canvas', () => {
        const spyStop = spyOn(component, 'start');
        component.enterCanvas({ buttons: 1 } as MouseEvent);
        expect(spyStop).toHaveBeenCalled();
    });
});
