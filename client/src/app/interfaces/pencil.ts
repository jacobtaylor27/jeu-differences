import { Tool } from '@app/constant/tool';

export interface Pencil {
    width: number;
    cap: CanvasLineCap;
    color: string;
    state: Tool;
}
