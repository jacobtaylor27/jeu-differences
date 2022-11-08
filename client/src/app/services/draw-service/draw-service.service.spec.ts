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

    it('should submit a form because the type is both', async () => {
        const spyDiff = spyOn(toolBoxServiceSpyObj.$resetDiff, 'next');
        const spySource = spyOn(toolBoxServiceSpyObj.$resetSource, 'next');
        service.reset(PropagateCanvasEvent.Both);
        expect(spyDiff).toHaveBeenCalled();
        expect(spySource).toHaveBeenCalled();
    });

    it('should submit a form because the type is difference', async () => {
        const spyDiff = spyOn(toolBoxServiceSpyObj.$resetDiff, 'next');
        const spySource = spyOn(toolBoxServiceSpyObj.$resetSource, 'next');
        service.reset(PropagateCanvasEvent.Difference);
        expect(spyDiff).toHaveBeenCalled();
        expect(spySource).not.toHaveBeenCalled();
    });

    it('should submit a form because the type is source', async () => {
        const spyDiff = spyOn(toolBoxServiceSpyObj.$resetDiff, 'next');
        const spySource = spyOn(toolBoxServiceSpyObj.$resetSource, 'next');
        service.reset(PropagateCanvasEvent.Source);
        expect(spyDiff).not.toHaveBeenCalled();
        expect(spySource).toHaveBeenCalled();
    });

    it('should verify if a both canvas is selected', () => {
        expect(service.isCanvasSelected(PropagateCanvasEvent.Both, PropagateCanvasEvent.Source)).toBeTrue();
        expect(service.isCanvasSelected(PropagateCanvasEvent.Both, PropagateCanvasEvent.Difference)).toBeTrue();
    });

    it('should verify if a draw canvas is selected', () => {
        expect(service.isCanvasSelected(PropagateCanvasEvent.Difference, PropagateCanvasEvent.Difference)).toBeTrue();
        expect(service.isCanvasSelected(PropagateCanvasEvent.Difference, PropagateCanvasEvent.Source)).toBeFalse();
    });

    it('should verify if a draw canvas is selected', () => {
        expect(service.isCanvasSelected(PropagateCanvasEvent.Source, PropagateCanvasEvent.Source)).toBeTrue();
        expect(service.isCanvasSelected(PropagateCanvasEvent.Source, PropagateCanvasEvent.Difference)).toBeFalse();
    });

    it('should check if the pencil is in mode eraser', () => {
        expect(service.isEraser(Tool.Eraser)).toBeTrue();
        expect(service.isEraser(Tool.Pencil)).toBeFalse();
    });
});
