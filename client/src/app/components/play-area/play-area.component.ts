import { Component, HostListener } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';

// TODO : Avoir un fichier séparé pour les constantes!
export const DEFAULT_WIDTH = 480;
export const DEFAULT_HEIGHT = 640;
const wrongSound = new Audio('../assets/sounds/wronganswer.wav');

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent {
    mousePosition: Vec2 = { x: 0, y: 0 };
    buttonPressed = '';

    private canvasSize = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    constructor(private readonly mouseHandlerService: MouseHandlerService) {}

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    mouseHitDetect($event: MouseEvent) {
        console.log(this.mouseHandlerService.mouseHitDetect($event));
        wrongSound.play();
    }
}
