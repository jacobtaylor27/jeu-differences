import { Injectable } from '@angular/core';
import { Pencil } from '@app/interfaces/pencil';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToolBoxService {
    $pencil: Map<string, Subject<Pencil>>;
    $uploadImage: Map<string, Subject<ImageBitmap>>;
    $reset: Map<string, Subject<void>>;

    constructor() {
        this.$pencil = new Map();
        this.$uploadImage = new Map();
        this.$reset = new Map();
    }
}
