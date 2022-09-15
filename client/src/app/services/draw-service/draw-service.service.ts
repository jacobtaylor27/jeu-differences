import { Injectable } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';

@Injectable({
    providedIn: 'root',
})
export class DrawService {
    reposition(canvas: HTMLCanvasElement, event: MouseEvent): Vec2 {
        return { x: event.clientX - canvas.offsetLeft, y: event.clientY - canvas.offsetTop };
    }
}
