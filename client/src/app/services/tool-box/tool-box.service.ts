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

    constructor() {
        this.$pencil = new Map();
        this.$uploadImage = new Map();
    }

    addCanvasType(canvasType: CanvasType) {
        this.$pencil.set(canvasType, new Subject<Pencil>());
        this.$uploadImage.set(canvasType, new Subject<ImageBitmap>());
    }
}
