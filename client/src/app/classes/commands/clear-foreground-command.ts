import { Command } from '@app/interfaces/command';
import { DrawingCommand } from '@app/interfaces/drawing-command';

export class ClearForegroundCommand implements DrawingCommand {
    command: Command;

    constructor(command: Command) {
        this.command = command;
    }

    execute() {
        console.log('execute clear Foreground');
    }
}
