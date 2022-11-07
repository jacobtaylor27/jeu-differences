import { Injectable } from '@angular/core';
import { CanvasType } from '@app/enums/canvas-type';
import { Pencil } from '@app/interfaces/pencil';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToolBoxService {
    $pencil: Map<CanvasType, Subject<Pencil>>;
    $uploadImage: Map<CanvasType, Subject<ImageBitmap>>;
    $reset: Map<CanvasType, Subject<void>>;
    $switchForeground: Map<CanvasType, Subject<void>>;
    constructor() {
        this.$pencil = new Map();
        this.$uploadImage = new Map();
        this.$reset = new Map();
        this.$switchForeground = new Map();
    }

    addCanvasType(canvasType: CanvasType) {
        this.$pencil.set(canvasType, new Subject<Pencil>());
        this.$uploadImage.set(canvasType, new Subject<ImageBitmap>());
        this.$reset.set(canvasType, new Subject<void>());
        this.$switchForeground.set(canvasType, new Subject<void>());
    }
}
