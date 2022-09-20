import { Tool } from '@app/enums/tool';

export interface Pencil {
    width: number;
    cap: CanvasLineCap;
    color: string;
    state: Tool;
}
