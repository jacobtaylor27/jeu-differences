import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';

// TODO : Avoir un fichier séparé pour les constantes!
const wrongSound = new Audio('../assets/sounds/wronganswer.wav');

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent {
    @ViewChild('actionsGame', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
    buttonPressed = '';

    constructor(private readonly mouseHandlerService: MouseHandlerService) {}

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    mouseHitDetect($event: MouseEvent) {
        // const ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        console.log(this.mouseHandlerService.mouseHitDetect($event));
        wrongSound.play();
    }
}
