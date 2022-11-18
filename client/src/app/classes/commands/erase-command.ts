import { DrawingCommand } from '@app/interfaces/drawing-command';

export class EraseCommand implements DrawingCommand {
    execute(): void {
        console.log('eraseCommand');
    }
}
