import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';

// TODO : Avoir un fichier séparé pour les constantes!
export const DEFAULT_WIDTH = 480;
export const DEFAULT_HEIGHT = 640;
const wrongSound = new Audio('../assets/sounds/wronganswer.wav');

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit {
    @ViewChild('gridCanvas', { static: false }) private canvas!: ElementRef<HTMLCanvasElement>;

    mousePosition: Vec2 = { x: 0, y: 0 };
    buttonPressed = '';

    private canvasSize = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

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

    ngAfterViewInit(): void {
        this.canvas.nativeElement.focus();
    }

    // TODO : déplacer ceci dans un service de gestion de la souris!
    mouseHitDetect(event: MouseEvent) {
        if (event.button === MouseButton.Left) {
            console.log(this.mousePosition.x);
            if (this.mousePosition.x > 250) {
                wrongSound.play();
            }
            this.mousePosition = { x: event.offsetX, y: event.offsetY };
        }
    }
}
