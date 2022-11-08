import { Injectable } from '@angular/core';
import { Command } from '@app/interfaces/command';

@Injectable({
    providedIn: 'root',
})
export class CommandService {
    // Having an index of -1 makes way more sens, because the default index is out of bound.
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    indexOfCommand: number = -1;
    commands: Command[] = [];
    currentCommand: Command = { name: '', stroke: { lines: [] }, style: { color: '', width: 0, cap: 'round', destination: 'source-over' } };

    redo() {}

    undo() {}
}
