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

    async manageCheatMode(ctx: CanvasRenderingContext2D, ctxModified: CanvasRenderingContext2D): Promise<void> {
        this.isCheatModeActivated = this.isCheatModeActivated ? this.stopCheatMode(ctx, ctxModified) : await this.startCheatMode(ctx, ctxModified);
    }

    stopCheatModeDifference(ctx: CanvasRenderingContext2D, ctxModified: CanvasRenderingContext2D, difference: Coordinate[]) {
        this.findClocksDifference(difference)?.clocks.forEach((clock: number) => clearInterval(clock));
        for (const coord of difference) {
            ctx.clearRect(coord.x, coord.y, 1, 1);
            ctxModified.clearRect(coord.x, coord.y, 1, 1);
        }
    }

    findClocksDifference(difference: Coordinate[]) {
        return this.intervals.find(
            (interval) =>
                interval.difference.length === difference.length &&
                interval.difference.every((differencePosition) =>
                    difference.find((position) => position.x === differencePosition.x && position.y === position.y),
                ),
        );
    }

    private async fetchAllDifferenceNotFound(): Promise<void> {
        return new Promise((resolve) => {
            this.socket.once(SocketEvent.FetchDifferences, (coords: Coordinate[][]) => {
                this.coords = coords;
                resolve();
            });
            this.socket.send(SocketEvent.FetchDifferences, { gameId: this.gameInformationHandler.roomId });
        });
    }

    private async startCheatMode(ctx: CanvasRenderingContext2D, ctxModified: CanvasRenderingContext2D): Promise<boolean> {
        await this.fetchAllDifferenceNotFound();
        this.coords.forEach((difference: Coordinate[]) =>
            this.intervals.push({ difference, clocks: this.startCheatModeDifference(ctx, ctxModified, difference) }),
        );
        return true;
    }

    private startCheatModeDifference(ctx: CanvasRenderingContext2D, ctxModified: CanvasRenderingContext2D, coords: Coordinate[]) {
        return [
            this.differenceDetectionHandler.displayDifferenceTemp(ctx, coords, true),
            this.differenceDetectionHandler.displayDifferenceTemp(ctxModified, coords, true),
        ];
    }

    private stopCheatMode(ctx: CanvasRenderingContext2D, ctxModified: CanvasRenderingContext2D): boolean {
        Array.from(this.intervals.map((interval) => interval.difference)).forEach((difference) =>
            this.stopCheatModeDifference(ctx, ctxModified, difference),
        );
        return false;
    }
}
