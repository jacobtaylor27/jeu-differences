import { Command } from '@app/interfaces/command';
import { DrawingCommand } from '@app/interfaces/drawing-command';

export class PasteExternalForegroundOnCommand implements DrawingCommand {
    command: Command;

    constructor(command: Command) {
        this.command = command;
    }
    execute(): void {
        console.log('PasteExternalForegroundOnCommand');
    }
}
