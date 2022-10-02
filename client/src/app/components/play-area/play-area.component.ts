import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { SIZE } from '@app/constants/canvas';
import { Vec2 } from '@app/interfaces/vec2';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';

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

    get width(): number {
        return SIZE.x;
    }

    get height(): number {
        return SIZE.y;
    }

    constructor(private readonly differencesDetectionHandlerService: DifferencesDetectionHandlerService) {}

    ngAfterViewInit(): void {
        this.displayImage();
        this.displayImageModified();
    }

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    getContextOriginal() {
        return this.canvasOriginal.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    async displayImage() {
        const ctx = this.canvasImgOriginal.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const imageData = new ImageData(640, 480);
        for (let i = 0; i < imageData.data.length; i += 4) {
            // Percentage in the x direction, times 255
            const x = 100;
            // Percentage in the y direction, times 255
            const y = 100;

            // Modify pixel data
            imageData.data[i + 0] = x;
            imageData.data[i + 1] = y;
            imageData.data[i + 2] = 255 - x;
            imageData.data[i + 3] = 255;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    async displayImageModified() {
        const ctx = this.canvasImgModified.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const imageData = new ImageData(640, 480);
        for (let i = 0; i < imageData.data.length; i += 4) {
            // Percentage in the x direction, times 255
            const x = 100;
            // Percentage in the y direction, times 255
            const y = 100;

            // Modify pixel data
            imageData.data[i + 0] = x;
            imageData.data[i + 1] = y;
            imageData.data[i + 2] = 255 - x;
            imageData.data[i + 3] = 255;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    private isMouseDisabled() {
        return this.differencesDetectionHandlerService.mouseIsDisabled;
    }

    onClick($event: MouseEvent, canvas: string) {
        if (!this.isMouseDisabled()) {
            this.mouseHitDetect($event, canvas);
        }
    }

    mouseHitDetect($event: MouseEvent, canvas: string) {
        this.mousePosition = { x: $event.offsetX, y: $event.offsetY };

        const ctx: CanvasRenderingContext2D =
            canvas === 'original' ? this.getContextOriginal() : (this.canvasModified.nativeElement.getContext('2d') as CanvasRenderingContext2D);

        this.differencesDetectionHandlerService.difference(this.mousePosition, ctx);
    }
}
