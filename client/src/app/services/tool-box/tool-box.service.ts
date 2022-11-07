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
    $resetBackground: Map<CanvasType, Subject<void>>;

    constructor() {
        this.$pencil = new Map();
        this.$uploadImage = new Map();
        this.$resetBackground = new Map();
    }

    addCanvasType(canvasType: CanvasType) {
        this.$pencil.set(canvasType, new Subject<Pencil>());
        this.$uploadImage.set(canvasType, new Subject<ImageBitmap>());
        this.$resetBackground.set(canvasType, new Subject<void>());
    }
}
