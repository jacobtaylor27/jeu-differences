import { Command } from '@app/interfaces/command';
import { DrawingCommand } from '@app/interfaces/drawing-command';

export class SwitchForegroundCommand implements DrawingCommand {
    command: Command;

    constructor(command: Command) {
        this.command = command;
    }
    execute(): void {
        console.log('switch Foreground Command');
    }
}
