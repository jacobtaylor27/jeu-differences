/* eslint-disable @typescript-eslint/no-magic-numbers */
import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { SIZE } from '@app/constants/canvas';
import { Vec2 } from '@app/interfaces/vec2';
import { CommunicationService } from '@app/services/communication/communication.service';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { Coordinate } from '@common/coordinate';
@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit {
    @ViewChild('actionsGameOriginal') canvasOriginal!: ElementRef<HTMLCanvasElement>;
    @ViewChild('actionsGameModified') canvasModified!: ElementRef<HTMLCanvasElement>;
    @ViewChild('imgOriginal') canvasImgOriginal!: ElementRef<HTMLCanvasElement>;
    @ViewChild('imgModified') canvasImgModified!: ElementRef<HTMLCanvasElement>;

    mousePosition: Vec2 = { x: 0, y: 0 };
    buttonPressed = '';
    gameId: string;

    constructor(
        private readonly differencesDetectionHandlerService: DifferencesDetectionHandlerService,
        private readonly gameInfoHandlerService: GameInformationHandlerService,
        private readonly communicationService: CommunicationService,
    ) {
        this.createGameRoom();
    }

    get width(): number {
        return SIZE.x;
    }

    get height(): number {
        return SIZE.y;
    }

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    ngAfterViewInit(): void {
        this.displayImage();
        this.displayImage(false);
    }

    // eslint-disable-next-line no-unused-vars
    onClick($event: MouseEvent, canvas: string) {
        if (!this.isMouseDisabled()) {
            this.mouseHitDetect($event, canvas);
        }
    }

    mouseHitDetect($event: MouseEvent, canvas: string) {
        this.mousePosition = { x: $event.offsetX, y: $event.offsetY };
        this.getDifferenceValidation(this.gameId, this.mousePosition);
        const ctx: CanvasRenderingContext2D = canvas === 'original' ? this.getContextOriginal() : this.getContextModified();
        this.differencesDetectionHandlerService.difference(this.mousePosition, ctx);
    }

    getContextImgOriginal() {
        return this.canvasImgOriginal.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    getContextImgModified() {
        return this.canvasImgModified.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    getContextOriginal() {
        return this.canvasOriginal.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    getContextModified() {
        return this.canvasModified.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    getImageData(source: string) {
        return this.communicationService.getImgData(source);
    }

    displayImage(isOriginalImage: boolean = true): void {
        const originalImageData = isOriginalImage
            ? this.getImageData(this.gameInfoHandlerService.getOriginalBmpId())
            : this.getImageData(this.gameInfoHandlerService.getModifiedBmpId());

        const ctx = isOriginalImage ? this.getContextImgOriginal() : this.getContextImgModified();

        originalImageData.subscribe((response: HttpResponse<{ width: number; height: number; data: number[] }> | null) => {
            if (!response || !response.body) {
                return;
            }
            const image: ImageData = new ImageData(new Uint8ClampedArray(response.body.data), response.body.width, response.body.height, {
                colorSpace: 'srgb',
            });

            ctx.putImageData(image, 0, 0);
        });
    }

    createGameRoom() {
        this.communicationService
            .createGameRoom(
                this.gameInfoHandlerService.getPlayerName(),
                this.gameInfoHandlerService.getGameMode(),
                this.gameInfoHandlerService.getGameInformation().id as string,
            )
            .subscribe((response: HttpResponse<{ id: string }> | null) => {
                if (!response || !response.body) {
                    return;
                }
                console.log(response.body.id);
                this.gameId = response.body.id;
            });
    }

    getDifferenceValidation(id: string, mousePosition: Vec2) {
        console.log('POST');
        return this.communicationService
            .validateCoordinates(id, mousePosition)
            .subscribe((response: HttpResponse<{ difference: Coordinate[]; isGameOver: boolean; differencesLeft: number }> | null) => {
                if (!response || !response.body) {
                    console.log('!response');
                    return;
                }
                console.log(response.body);
            });
    }

    private isMouseDisabled() {
        return this.differencesDetectionHandlerService.mouseIsDisabled;
    }
}
