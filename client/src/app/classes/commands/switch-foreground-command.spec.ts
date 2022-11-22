import { ElementRef } from '@angular/core';
import { CanvasType } from '@app/enums/canvas-type';
import { CanvasState } from '@app/interfaces/canvas-state';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { SwitchForegroundCommand } from './switch-foreground-command';

describe('clearForegroundCommand', () => {
    let drawServiceSpy: jasmine.SpyObj<DrawService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawService', ['switchForegroundImageData']);
    });

    it('pasteForeground should be called', () => {
        const firstCanvasState: CanvasState = {
            canvasType: CanvasType.Right,
            foreground: {} as ElementRef<HTMLCanvasElement>,
            background: {} as ElementRef<HTMLCanvasElement>,
            temporary: {} as ElementRef<HTMLCanvasElement>,
        };

        const secondCanvasState: CanvasState = {
            canvasType: CanvasType.Right,
            foreground: {} as ElementRef<HTMLCanvasElement>,
            background: {} as ElementRef<HTMLCanvasElement>,
            temporary: {} as ElementRef<HTMLCanvasElement>,
        };
        const command = new SwitchForegroundCommand(firstCanvasState, secondCanvasState, drawServiceSpy);
        command.execute();
        expect(drawServiceSpy.switchForegroundImageData).toHaveBeenCalledWith(firstCanvasState, secondCanvasState);
    });
});
