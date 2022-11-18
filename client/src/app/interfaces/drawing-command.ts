import { Command } from './command';

export interface DrawingCommand {
    command: Command;
    execute(): void;
}
