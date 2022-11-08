import { Injectable } from '@angular/core';
import { CommandService } from '@app/services/command-service/command.service';

@Injectable({
    providedIn: 'root',
})
export class CanvasEventHandlerService {
    constructor(private commandService: CommandService) {}

    handleCtrlShiftZ() {}

    handleCtrlZ() {}
}
