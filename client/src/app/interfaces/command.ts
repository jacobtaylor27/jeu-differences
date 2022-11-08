import { Stroke } from './stroke';
import { StrokeStyle } from './stroke-style';

export interface Command {
    name: string;
    stroke: Stroke;
    style: StrokeStyle;
}
