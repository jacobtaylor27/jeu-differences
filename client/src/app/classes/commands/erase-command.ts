import { Command } from '@app/interfaces/command';
import { DrawingCommand } from '@app/interfaces/drawing-command';

export class EraseCommand implements DrawingCommand {
    command: Command;

    constructor(command: Command) {
        this.command = command;
    }
    execute(): void {
        console.log('eraseCommand');
    }
}
