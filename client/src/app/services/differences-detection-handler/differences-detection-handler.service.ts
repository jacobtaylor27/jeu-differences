/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Vec2 } from '@app/interfaces/vec2';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { Coordinate } from '@common/coordinate';
import { SocketEvent } from '@common/socket-event';
@Injectable({
    providedIn: 'root',
})
export class DifferencesDetectionHandlerService {
    mouseIsDisabled: boolean = false;
    nbDifferencesFound: number;
    nbTotalDifferences: number;
    isGameOver: boolean = false;
    contextImgModified: CanvasRenderingContext2D;

    // eslint-disable-next-line max-params
    constructor(
        public matDialog: MatDialog,
        private readonly socketService: CommunicationSocketService,
        private readonly gameInfoHandlerService: GameInformationHandlerService,
    ) {}

    setNumberDifferencesFound(isPlayerAction: boolean, nbTotalDifference: number) {
        this.nbTotalDifferences = nbTotalDifference;
        this.gameInfoHandlerService.players[isPlayerAction ? 0 : 1].nbDifferences++;
        this.gameInfoHandlerService.$differenceFound.next(this.gameInfoHandlerService.players[isPlayerAction ? 0 : 1].name);
        this.nbDifferencesFound++;
    }

    resetNumberDifferencesFound() {
        this.nbTotalDifferences = 0;
        this.nbDifferencesFound = 0;
    }

    playWrongSound() {
        this.playSound(new Audio('assets/wronganswer.wav'));
    }

    playCorrectSound() {
        this.playSound(new Audio('assets/correctanswer.wav'));
    }

    playSound(sound: HTMLAudioElement) {
        sound.play();
    }

    getDifferenceValidation(id: string, mousePosition: Vec2, ctx: CanvasRenderingContext2D) {
        this.socketService.send(SocketEvent.Difference, { differenceCoord: mousePosition, gameId: id });
        this.handleSocketDifferenceNotFound(ctx, mousePosition);
    }

    handleSocketDifferenceNotFound(ctx: CanvasRenderingContext2D, mousePosition: Vec2) {
        this.socketService.once(SocketEvent.DifferenceNotFound, () => {
            this.differenceNotDetected(mousePosition, ctx);
        });
    }

    setContextImgModified(ctx: CanvasRenderingContext2D) {
        this.contextImgModified = ctx;
    }

    differenceNotDetected(mousePosition: Vec2, ctx: CanvasRenderingContext2D) {
        this.playWrongSound();
        ctx.fillStyle = 'red';
        ctx.fillText('Erreur', mousePosition.x, mousePosition.y, 30);
        this.mouseIsDisabled = true;

        // block
        setTimeout(() => {
            this.mouseIsDisabled = false;
            ctx.clearRect(mousePosition.x, mousePosition.y, 30, -30);
        }, 1000);
    }

    differenceDetected(ctx: CanvasRenderingContext2D, ctxModified: CanvasRenderingContext2D, coords: Coordinate[]) {
        this.playCorrectSound();
        this.displayDifferenceTemp(ctx, coords);
        this.clearDifference(ctxModified, coords);
        this.socketService.off(SocketEvent.DifferenceNotFound);
    }

    private displayDifferenceTemp(ctx: CanvasRenderingContext2D, coords: Coordinate[]) {
        let counter = 0;
        const interval = setInterval(() => {
            for (const coordinate of coords) {
                ctx.clearRect(coordinate.x, coordinate.y, 1, 1);
            }
            if (counter === 5) {
                clearInterval(interval);
            }
            if (counter % 2 === 0) {
                ctx.fillStyle = 'yellow';
                for (const coordinate of coords) {
                    ctx.fillRect(coordinate.x, coordinate.y, 1, 1);
                }
            }

            counter++;
        }, 500);
    }

    private clearDifference(ctx: CanvasRenderingContext2D, coords: Coordinate[]) {
        for (const coordinate of coords) {
            ctx.clearRect(coordinate.x, coordinate.y, 1, 1);
        }
    }
}
