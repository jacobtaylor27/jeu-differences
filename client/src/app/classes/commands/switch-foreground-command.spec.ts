import { ElementRef } from '@angular/core';
import { CanvasType } from '@app/enums/canvas-type';
import { DrawingBoardState } from '@app/interfaces/drawing-board-state';
import { SwitchForegroundCommand } from './switch-foreground-command';

describe('switchForegroundCommand', () => {
    it('execute should be call switchForegroundImageData', () => {
        const firstCanvasState: DrawingBoardState = {
            canvasType: CanvasType.Right,
            foreground: {} as ElementRef<HTMLCanvasElement>,
            background: {} as ElementRef<HTMLCanvasElement>,
            temporary: {} as ElementRef<HTMLCanvasElement>,
        };

        const secondCanvasState: DrawingBoardState = {
            canvasType: CanvasType.Right,
            foreground: {} as ElementRef<HTMLCanvasElement>,
            background: {} as ElementRef<HTMLCanvasElement>,
            temporary: {} as ElementRef<HTMLCanvasElement>,
        };
        const command = new SwitchForegroundCommand(firstCanvasState, secondCanvasState);
        const spySwitchForegroundImageData = spyOn(Object.getPrototypeOf(command), 'switchForegroundImageData');
        command.execute();
        expect(spySwitchForegroundImageData).toHaveBeenCalledWith(firstCanvasState, secondCanvasState);
    });

    it('switchForegroundImageData should switch the data from two foreground', () => {
        const firstCanvasState: DrawingBoardState = {
            canvasType: CanvasType.Left,
            foreground: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            background: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            temporary: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
        };

        const secondCanvasState: DrawingBoardState = {
            canvasType: CanvasType.Right,
            foreground: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            background: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            temporary: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
        };

        const firstPutImageSpy = spyOn(firstCanvasState.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D, 'putImageData');
        const firstGetImageSpy = spyOn(firstCanvasState.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D, 'getImageData');
        const secondPutImageSpy = spyOn(secondCanvasState.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D, 'putImageData');
        const secondGetImageSpy = spyOn(secondCanvasState.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D, 'getImageData');

        const command = new SwitchForegroundCommand(firstCanvasState, secondCanvasState);
        command['switchForegroundImageData'](firstCanvasState, secondCanvasState);

        expect(firstGetImageSpy).toHaveBeenCalled();
        expect(firstPutImageSpy).toHaveBeenCalled();
        expect(secondGetImageSpy).toHaveBeenCalled();
        expect(secondPutImageSpy).toHaveBeenCalled();
    });
});
