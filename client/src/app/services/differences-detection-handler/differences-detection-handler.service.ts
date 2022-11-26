/* eslint-disable @typescript-eslint/no-magic-numbers -- tests for differences detection with random numbers*/
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FlashTimer } from '@app/constants/game-constants';
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
    correctSound = new Audio('assets/correctanswer.wav');
    wrongSound = new Audio('assets/wronganswer.wav');

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
        this.playSound(this.wrongSound);
    }

    playCorrectSound() {
        this.playSound(this.correctSound);
        this.socketService.off(SocketEvent.DifferenceNotFound);
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
        this.displayDifferenceTemp(ctx, coords, false);
        this.clearDifference(ctxModified, coords);
    }

    displayDifferenceTemp(ctx: CanvasRenderingContext2D, coords: Coordinate[], isCheatMode: boolean): number {
        let counter = 0;
        const interval = setInterval(
            () => {
                for (const coordinate of coords) {
                    ctx.clearRect(coordinate.x, coordinate.y, 1, 1);
                }
                if (counter === 5 && !isCheatMode) {
                    clearInterval(interval);
                }
                if (counter % 2 === 0) {
                    ctx.fillStyle = 'yellow';
                    for (const coordinate of coords) {
                        ctx.fillRect(coordinate.x, coordinate.y, 1, 1);
                    }
                }
                counter++;
            },
            isCheatMode ? FlashTimer.CheatMode : FlashTimer.Classic,
        ) as unknown as number;
        return interval;
    }

    async drawQuadrant(ctx: CanvasRenderingContext2D, quadrantCoordinate: Coordinate[]) {
        if (quadrantCoordinate[1].y === -1) {
            this.fillText(ctx, quadrantCoordinate);
        } else {
            this.drawRect(ctx, quadrantCoordinate);
        }
    }

    private fillText(ctx: CanvasRenderingContext2D, quadrantCoordinate: Coordinate[]) {
        ctx.font = '40px serif';
        let counter = 0;
        const interval = setInterval(() => {
            ctx.fillStyle = 'black';
            ctx.clearRect(quadrantCoordinate[0].x, quadrantCoordinate[0].y, 100, -100);

            if (counter === 5) {
                clearInterval(interval);
            }
            if (counter % 2 === 0) {
                ctx.fillText(`(${quadrantCoordinate[0].x},${quadrantCoordinate[0].y})`, quadrantCoordinate[0].x, quadrantCoordinate[0].y, 100);
            }
            counter++;
        }, FlashTimer.Classic) as unknown as number;
    }

    private drawRect(ctx: CanvasRenderingContext2D, quadrantCoordinate: Coordinate[]) {
        const width = Math.abs(quadrantCoordinate[1].x - quadrantCoordinate[0].x);
        const height = Math.abs(quadrantCoordinate[1].y - quadrantCoordinate[0].y);
        let counter = 0;
        const interval = setInterval(() => {
            ctx.clearRect(quadrantCoordinate[0].x, quadrantCoordinate[0].y, width, height);

            if (counter === 5) {
                clearInterval(interval);
            }
            if (counter % 2 === 0) {
                ctx.rect(quadrantCoordinate[0].x, quadrantCoordinate[0].y, width, height);
                ctx.stroke();
            }
            counter++;
        }, FlashTimer.Classic) as unknown as number;
    }

    private clearDifference(ctx: CanvasRenderingContext2D, coords: Coordinate[]) {
        for (const coordinate of coords) {
            ctx.clearRect(coordinate.x, coordinate.y, 1, 1);
        }
    }
}
