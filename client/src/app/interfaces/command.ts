import { Stroke } from '@app/interfaces/stroke';
import { StrokeStyle } from '@app/interfaces/stroke-style';

export interface Command {
    name: string;
    stroke: Stroke;
    style: StrokeStyle;
}
