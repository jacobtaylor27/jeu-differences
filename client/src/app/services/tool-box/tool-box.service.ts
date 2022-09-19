import { Injectable } from '@angular/core';
import { Pencil } from '@app/interfaces/pencil';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToolBoxService {
    $pencil: Subject<Pencil>;
    constructor() {
        this.$pencil = new Subject();
    }
}
