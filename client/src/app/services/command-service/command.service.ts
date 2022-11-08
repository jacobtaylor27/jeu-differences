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

    redo() {
        if (this.indexOfCommand >= this.commands.length - 1) {
            return;
        }
        this.indexOfCommand++;
        this.executeAllCommand();
    }

    undo() {
        // same justification as before
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (this.indexOfCommand <= -1) {
            return;
        }
        this.indexOfCommand--;
        this.executeAllCommand();
    }

    executeAllCommand() {
        for (let i = 0; i < this.indexOfCommand + 1; i++) {
            this.commands[i].execute();
        }
    }
}
