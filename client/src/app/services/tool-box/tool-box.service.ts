import { Injectable } from '@angular/core';
import { Pencil } from '@app/interfaces/pencil';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToolBoxService {
    $pencil: Subject<Pencil>;
    $uploadImageInSource: Subject<ImageBitmap>;
    $uploadImageInDiff: Subject<ImageBitmap>;
    constructor() {
        this.$uploadImageInSource = new Subject();
        this.$uploadImageInDiff = new Subject();
        this.$pencil = new Subject();
    }
}
