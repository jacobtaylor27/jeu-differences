import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { SIZE } from '@app/constants/canvas';
import { Vec2 } from '@app/interfaces/vec2';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent {
    @ViewChild('actionsGameOriginal') canvasOriginal!: ElementRef<HTMLCanvasElement>;
    @ViewChild('actionsGameModified') canvasModified!: ElementRef<HTMLCanvasElement>;
    mousePosition: Vec2 = { x: 0, y: 0 };
    buttonPressed = '';

    get width(): number {
        return SIZE.x;
    }

    get height(): number {
        return SIZE.y;
    }

    constructor(private readonly differencesDetectionHandlerService: DifferencesDetectionHandlerService) {}

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    mouseHitDetect($event: MouseEvent, canvas: String) {
        this.mousePosition = { x: $event.offsetX, y: $event.offsetY };

        const ctx: CanvasRenderingContext2D =
            canvas === 'original'
                ? (this.canvasOriginal.nativeElement.getContext('2d') as CanvasRenderingContext2D)
                : (this.canvasModified.nativeElement.getContext('2d') as CanvasRenderingContext2D);

        this.differencesDetectionHandlerService.difference(this.mousePosition, ctx);
    }
}
