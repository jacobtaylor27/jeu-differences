import { Injectable } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';

@Injectable({
    providedIn: 'root',
})
export class MouseHandlerService {
    mouseHitDetect(event: MouseEvent): Vec2 {
        return { x: event.clientX, y: event.clientY };
    }
}
