import { Tool } from '@app/enums/tool';

export interface Pencil {
    width: { pencil: number; eraser: number };
    cap: CanvasLineCap;
    color: string;
    state: Tool;
}
