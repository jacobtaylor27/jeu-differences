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
});
