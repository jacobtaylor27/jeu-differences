import { Injectable } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawService {
    $differenceImage: Subject<ImageBitmap>;
    constructor() {
        this.$differenceImage = new Subject();
    }
    reposition(canvas: HTMLCanvasElement, event: MouseEvent): Vec2 {
        return { x: event.clientX - canvas.offsetLeft, y: event.clientY - canvas.offsetTop };
    }
}
