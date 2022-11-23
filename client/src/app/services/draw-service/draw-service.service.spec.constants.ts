import { ElementRef } from '@angular/core';
import { CanvasType } from '@app/enums/canvas-type';
import { Tool } from '@app/enums/tool';
import { Command } from '@app/interfaces/command';
import { DrawingBoardState } from '@app/interfaces/drawing-board-state';
import { Line } from '@app/interfaces/line';
import { Pencil } from '@app/interfaces/pencil';
import { Stroke } from '@app/interfaces/stroke';
import { StrokeStyle } from '@app/interfaces/stroke-style';

export const drawingBoardStub: DrawingBoardState = {
    canvasType: CanvasType.None,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    foreground: { nativeElement: { getContext: () => {} } } as unknown as ElementRef<HTMLCanvasElement>,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    background: { nativeElement: { getContext: () => {} } } as unknown as ElementRef<HTMLCanvasElement>,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    temporary: { nativeElement: { getContext: () => {} } } as unknown as ElementRef<HTMLCanvasElement>,
};

export const fakeMouseEvent = {
    clientX: 0,
    clientY: 0,
} as MouseEvent;

export const fakePencil: Pencil = {
    color: 'orange',
    cap: 'round',
    width: { pencil: 1, eraser: 3 },
    state: Tool.Pencil,
};

export const fakeLines: Line = {
    initCoord: { x: 0, y: 0 },
    finalCoord: { x: 0, y: 0 },
};

export const fakeStroke: Stroke = {
    lines: [],
};

export const fakeCurrentCommand: Command = {
    canvasType: CanvasType.None,
    name: 'test',
    strokes: [],
    style: {} as StrokeStyle,
};

export const fakeStrokeStyle: StrokeStyle = {
    color: 'orange',
    cap: 'round',
    destination: 'source-over',
    width: 4,
};
