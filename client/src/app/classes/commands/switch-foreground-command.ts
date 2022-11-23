import { Canvas } from '@app/enums/canvas';
import { DrawingBoardState } from '@app/interfaces/drawing-board-state';
import { DrawingCommand } from '@app/interfaces/drawing-command';

export class SwitchForegroundCommand implements DrawingCommand {
    private leftCanvas: DrawingBoardState;
    private rightCanvas: DrawingBoardState;

    constructor(leftCanvas: DrawingBoardState, rightCanvas: DrawingBoardState) {
        this.leftCanvas = leftCanvas;
        this.rightCanvas = rightCanvas;
    }

    execute(): void {
        this.switchForegroundImageData(this.leftCanvas, this.rightCanvas);
    }

    private switchForegroundImageData(primaryCanvasState: DrawingBoardState, secondCanvasState: DrawingBoardState) {
        const primaryForeground = primaryCanvasState.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const secondForeground = secondCanvasState.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const leftImageData = primaryForeground.getImageData(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
        const rightImageData = secondForeground.getImageData(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
        primaryForeground.putImageData(rightImageData, 0, 0);
        secondForeground.putImageData(leftImageData, 0, 0);
    }
}
