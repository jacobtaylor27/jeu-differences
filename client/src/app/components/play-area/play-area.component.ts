/* eslint-disable @typescript-eslint/no-magic-numbers */
import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { SIZE } from '@app/constants/canvas';
import { CommunicationService } from '@app/services/communication/communication.service';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';
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
    @ViewChild('imgModifiedWODifference') canvasImgDifference!: ElementRef<HTMLCanvasElement>;
    @Input() gameId: string;
    // private readonly gameOverDialogRef: TemplateRef<HTMLElement>;
    buttonPressed = '';

    // eslint-disable-next-line max-params
    constructor(
        private readonly differencesDetectionHandlerService: DifferencesDetectionHandlerService,
        private readonly gameInfoHandlerService: GameInformationHandlerService,
        private readonly communicationService: CommunicationService,
        private readonly mouseHandlerService: MouseHandlerService,
    ) {}

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
        this.displayImage(true, this.getContextImgOriginal());
        this.displayImage(false, this.getContextImgModified());
        this.displayImage(true, this.getContextDifferences());
        this.differencesDetectionHandlerService.setContextImgModified(this.getContextImgModified());
    }

    // eslint-disable-next-line no-unused-vars
    onClick($event: MouseEvent, canvas: string) {
        if (!this.isMouseDisabled()) {
            const ctx: CanvasRenderingContext2D = canvas === 'original' ? this.getContextOriginal() : this.getContextModified();
            this.mouseHandlerService.mouseHitDetect($event, ctx, this.gameId);
        }
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

    getContextDifferences() {
        return this.canvasImgDifference.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    getImageData(source: string) {
        return this.communicationService.getImgData(source);
    }

    displayImage(isOriginalImage: boolean = true, ctx: CanvasRenderingContext2D): void {
        const originalImageData = isOriginalImage
            ? this.getImageData(this.gameInfoHandlerService.getOriginalBmpId())
            : this.getImageData(this.gameInfoHandlerService.getModifiedBmpId());

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

    private isMouseDisabled() {
        return this.differencesDetectionHandlerService.mouseIsDisabled;
    }
}
