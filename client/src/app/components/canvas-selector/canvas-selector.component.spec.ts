import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasSelectorComponent } from './canvas-selector.component';

describe('CanvasSelectorComponent', () => {
    let component: CanvasSelectorComponent;
    let fixture: ComponentFixture<CanvasSelectorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CanvasSelectorComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CanvasSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should draw an rectangle', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const expectedCtx = { rect: () => {}, fill: () => {}, fillStyle: '' } as unknown as CanvasRenderingContext2D;
        const spyRect = spyOn(expectedCtx, 'rect');
        const spyFill = spyOn(expectedCtx, 'fill');
        component.draw(expectedCtx);
        expect(spyFill).toHaveBeenCalled();
        expect(spyRect).toHaveBeenCalled();
    });

    it('should erase the rectangle', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const expectedCtx = { clearRect: () => {} } as unknown as CanvasRenderingContext2D;
        const spyClearRect = spyOn(expectedCtx, 'clearRect');
        component.erase(expectedCtx);
        expect(spyClearRect).toHaveBeenCalled();
    });

    it('should draw if the state of the canvas is false', () => {
        component.isCanvasSelect = { draw: false, compare: false };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyDraw = spyOn(component, 'draw').and.callFake(() => {});
        component.canvasManager({} as CanvasRenderingContext2D, 'draw');
        expect(spyDraw).toHaveBeenCalled();
        component.canvasManager({} as CanvasRenderingContext2D, 'compare');
        expect(spyDraw).toHaveBeenCalledTimes(2);
    });

    it('should erase if the state of the canvas is true', () => {
        component.isCanvasSelect = { draw: true, compare: true };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyErase = spyOn(component, 'erase').and.callFake(() => {});
        component.canvasManager({} as CanvasRenderingContext2D, 'draw');
        expect(spyErase).toHaveBeenCalled();
        component.canvasManager({} as CanvasRenderingContext2D, 'compare');
        expect(spyErase).toHaveBeenCalledTimes(2);
    });
