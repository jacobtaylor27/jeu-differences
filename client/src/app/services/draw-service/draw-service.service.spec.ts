import { TestBed } from '@angular/core/testing';
import { CanvasType } from '@app/enums/canvas-type';
import { Tool } from '@app/enums/tool';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { Subject } from 'rxjs';

import { DrawService } from './draw-service.service';

describe('DrawServiceService', () => {
    let service: DrawService;
    let toolBoxServiceSpyObj: jasmine.SpyObj<ToolBoxService>;
    beforeEach(() => {
        toolBoxServiceSpyObj = jasmine.createSpyObj('ToolBoxService', [], { $resetBackground: new Map(), $resetForeground: new Map() });
        TestBed.configureTestingModule({
            providers: [{ provide: ToolBoxService, useValue: toolBoxServiceSpyObj }],
        });
        service = TestBed.inject(DrawService);
        toolBoxServiceSpyObj.$resetBackground.set(CanvasType.Left, new Subject());
        toolBoxServiceSpyObj.$resetBackground.set(CanvasType.Right, new Subject());
        toolBoxServiceSpyObj.$resetForeground.set(CanvasType.Left, new Subject());
        toolBoxServiceSpyObj.$resetForeground.set(CanvasType.Right, new Subject());
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('reposition should return a position', () => {
        const expectedReposition = { x: 10, y: 10 };
        expect(service.reposition({ offsetLeft: 0, offsetTop: 0 } as HTMLCanvasElement, { clientX: 10, clientY: 10 } as MouseEvent)).toEqual(
            expectedReposition,
        );
    });

    it('should reset background for both canvas', async () => {
        const spyResetBackgroundLeft = spyOn(toolBoxServiceSpyObj.$resetBackground.get(CanvasType.Left) as Subject<void>, 'next');
        const spyResetBackgroundRight = spyOn(toolBoxServiceSpyObj.$resetBackground.get(CanvasType.Right) as Subject<void>, 'next');
        service.resetBackground(CanvasType.Both);
        expect(spyResetBackgroundLeft).toHaveBeenCalled();
        expect(spyResetBackgroundRight).toHaveBeenCalled();
    });

    it('should reset background for Left background', async () => {
        const spyResetBackgroundLeft = spyOn(toolBoxServiceSpyObj.$resetBackground.get(CanvasType.Left) as Subject<void>, 'next');
        const spyResetBackgroundRight = spyOn(toolBoxServiceSpyObj.$resetBackground.get(CanvasType.Right) as Subject<void>, 'next');
        service.resetBackground(CanvasType.Left);
        expect(spyResetBackgroundLeft).toHaveBeenCalled();
        expect(spyResetBackgroundRight).not.toHaveBeenCalled();
    });

    it('should reset background for Right background', async () => {
        const spyResetBackgroundLeft = spyOn(toolBoxServiceSpyObj.$resetBackground.get(CanvasType.Left) as Subject<void>, 'next');
        const spyResetBackgroundRight = spyOn(toolBoxServiceSpyObj.$resetBackground.get(CanvasType.Right) as Subject<void>, 'next');
        service.resetBackground(CanvasType.Right);
        expect(spyResetBackgroundLeft).not.toHaveBeenCalled();
        expect(spyResetBackgroundRight).toHaveBeenCalled();
    });

    it('should check if the pencil is in mode eraser', () => {
        expect(service.isEraser(Tool.Eraser)).toBeTrue();
        expect(service.isEraser(Tool.Pencil)).toBeFalse();
    });

    it('should add drawing canvas', () => {
        const spyDrawImage = spyOn(service.$drawingImage, 'set');
        service.addDrawingCanvas(CanvasType.Left);
        expect(spyDrawImage).toHaveBeenCalled();
    });

    it('should reset foreground for both canvas', () => {
        toolBoxServiceSpyObj.$resetForeground.set(CanvasType.Left, new Subject());
        toolBoxServiceSpyObj.$resetForeground.set(CanvasType.Right, new Subject());
        const spyResetForegroundLeft = spyOn(toolBoxServiceSpyObj.$resetForeground.get(CanvasType.Left) as Subject<void>, 'next');
        const spyResetForegroundRight = spyOn(toolBoxServiceSpyObj.$resetForeground.get(CanvasType.Right) as Subject<void>, 'next');
        service.resetForeground(CanvasType.Both);
        expect(spyResetForegroundLeft).toHaveBeenCalled();
        expect(spyResetForegroundRight).toHaveBeenCalled();
    });

    it('should reset foreground for left canvas', () => {
        toolBoxServiceSpyObj.$resetForeground.set(CanvasType.Left, new Subject());
        toolBoxServiceSpyObj.$resetForeground.set(CanvasType.Right, new Subject());
        const spyResetForegroundLeft = spyOn(toolBoxServiceSpyObj.$resetForeground.get(CanvasType.Left) as Subject<void>, 'next');
        const spyResetForegroundRight = spyOn(toolBoxServiceSpyObj.$resetForeground.get(CanvasType.Right) as Subject<void>, 'next');
        service.resetForeground(CanvasType.Left);
        expect(spyResetForegroundLeft).toHaveBeenCalled();
        expect(spyResetForegroundRight).not.toHaveBeenCalled();
    });

    it('should reset foreground for right canvas', () => {
        toolBoxServiceSpyObj.$resetForeground.set(CanvasType.Left, new Subject());
        toolBoxServiceSpyObj.$resetForeground.set(CanvasType.Right, new Subject());
        const spyResetForegroundLeft = spyOn(toolBoxServiceSpyObj.$resetForeground.get(CanvasType.Left) as Subject<void>, 'next');
        const spyResetForegroundRight = spyOn(toolBoxServiceSpyObj.$resetForeground.get(CanvasType.Right) as Subject<void>, 'next');
        service.resetForeground(CanvasType.Right);
        expect(spyResetForegroundLeft).not.toHaveBeenCalled();
        expect(spyResetForegroundRight).toHaveBeenCalled();
    });
});
