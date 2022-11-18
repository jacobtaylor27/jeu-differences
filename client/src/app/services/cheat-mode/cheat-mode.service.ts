import { Injectable } from '@angular/core';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { Coordinate } from '@common/coordinate';
import { SocketEvent } from '@common/socket-event';

@Injectable({
    providedIn: 'root',
})
export class CheatModeService {
    coords: Coordinate[][];
    intervals: { difference: Coordinate[]; clocks: number[] }[] = [];
    isCheatModeActivated: boolean = false;

    constructor(
        private differenceDetectionHandler: DifferencesDetectionHandlerService,
        private socket: CommunicationSocketService,
        private gameInformationHandler: GameInformationHandlerService,
    ) {}

    manageCheatMode(ctx: CanvasRenderingContext2D, ctxModified: CanvasRenderingContext2D) {
        this.isCheatModeActivated = this.isCheatModeActivated ? this.stopCheatMode(ctx, ctxModified) : this.startCheatMode(ctx, ctxModified);
    }

    stopCheatModeDifference(ctx: CanvasRenderingContext2D, ctxModified: CanvasRenderingContext2D, difference: Coordinate[]) {
        this.findClocksDifferenceIndex(difference)?.clocks.forEach((clock: number) => clearInterval(clock));
        for (const coord of difference) {
            ctx.clearRect(coord.x, coord.y, 1, 1);
            ctxModified.clearRect(coord.x, coord.y, 1, 1);
        }
    }
