import { Injectable } from '@angular/core';
import { Command } from '@app/interfaces/command';

@Injectable({
    providedIn: 'root',
})
export class CommandService {
    commands: Command[] = [];

    redo() {}

    undo() {}
}
