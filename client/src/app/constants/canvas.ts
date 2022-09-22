import { Tool } from '@app/enums/tool';
import { Pencil } from '@app/interfaces/pencil';
import { Vec2 } from '@app/interfaces/vec2';

export const SIZE: Vec2 = { x: 480, y: 640 };
export const DEFAULT_PENCIL: Pencil = { width: 1, cap: 'round', color: '#000000', state: Tool.Pencil };
export const DEFAULT_POSITION_MOUSE_CLIENT: Vec2 = { x: 0, y: 0 };
export const DEFAULT_DRAW_CLIENT = false;
export const IMAGE_TYPE = 'image/bmp';