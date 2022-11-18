import { Command } from '@app/interfaces/command';

export class DrawCommand implements DrawCommand {
    command: Command;

    constructor(command: Command) {
        this.command = command;
    }

    execute(): void {
        console.log('draw command');
    }
}
