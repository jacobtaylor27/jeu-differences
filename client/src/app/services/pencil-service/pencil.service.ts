import { Injectable } from '@angular/core';
import { Tool } from '@app/enums/tool';
import { Pencil } from '@app/interfaces/pencil';

@Injectable({
    providedIn: 'root',
})
export class PencilService {
    pencil: Pencil = { width: { pencil: 1, eraser: 2 }, cap: 'round', color: '#000000', state: Tool.Pencil };
}
