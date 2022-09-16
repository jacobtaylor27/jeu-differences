import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawService } from '@app/services/draw-service/draw-service.service';

import { DrawCanvasComponent } from './draw-canvas.component';

describe('DrawCanvasComponent', () => {
    let component: DrawCanvasComponent;
    let fixture: ComponentFixture<DrawCanvasComponent>;
    let drawServiceSpyObj: jasmine.SpyObj<DrawService>;
    beforeEach(async () => {
        drawServiceSpyObj = jasmine.createSpyObj('DrawService', ['reposition']);
        await TestBed.configureTestingModule({
            declarations: [DrawCanvasComponent],
            providers: [{ provide: DrawService, useValue: drawServiceSpyObj }],
        }).compileComponents();
        fixture = TestBed.createComponent(DrawCanvasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('start should change the click state and call to reposition the pointer', () => {
        drawServiceSpyObj.reposition.and.returnValue({ x: 0, y: 0 });
        component.isClick = false;
        component.start({} as MouseEvent);
        expect(component.isClick).toBeTrue();
        expect(drawServiceSpyObj.reposition).toHaveBeenCalled();
        component.isClick = false;
        component.start({} as MouseEvent);
        expect(component.isClick).toBeTrue();
    });
    it('should stop to draw in the canvas', () => {
        component.isClick = true;
        component.stop();
        expect(component.isClick).toBeFalse();
        component.isClick = false;
        component.stop();
        expect(component.isClick).toBeFalse();
    });

    it('should draw when the client is clicking on the canvas', () => {
        component.isClick = false;
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function
        const drawPointSpy = spyOn(component, 'drawPoint');
        component.draw({} as MouseEvent);
        expect(drawPointSpy).not.toHaveBeenCalled();
        component.isClick = true;
        component.draw({} as MouseEvent);
        expect(drawPointSpy).toHaveBeenCalled();
    });

    it('drawPoint should set the style of the pensil and create the point', () => {
        component.coordDraw = { x: 0, y: 0 };
        component.canvas = { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>;
        component.pencil = { width: 5, cap: 'round', color: component.color };
        drawServiceSpyObj.reposition.and.returnValue({ x: 0, y: 0 });
        const ctx = component.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const beginPathSpy = spyOn(ctx, 'beginPath');
        const moveToSpy = spyOn(ctx, 'moveTo');
        const lineToSpy = spyOn(ctx, 'lineTo');
        const stokeSpy = spyOn(ctx, 'stroke');
        component.drawPoint({} as MouseEvent);
        expect(beginPathSpy).toHaveBeenCalled();
        expect(moveToSpy).toHaveBeenCalled();
        expect(lineToSpy).toHaveBeenCalled();
        expect(stokeSpy).toHaveBeenCalled();
        expect(drawServiceSpyObj.reposition).toHaveBeenCalled();
        expect(ctx.lineWidth).toEqual(component.pencil.width);
        expect(ctx.lineCap).toEqual(component.pencil.cap);
        expect(ctx.strokeStyle).toEqual(component.pencil.color);
    });
});
