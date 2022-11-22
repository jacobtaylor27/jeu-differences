import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CluesService } from '@app/services/clues-service/clues.service';
@Component({
    selector: 'app-clues-area',
    templateUrl: './clues-area.component.html',
    styleUrls: ['./clues-area.component.scss'],
})
export class CluesAreaComponent {
    @Output() clueCounter = new EventEmitter<number>();

    clueAskedCounter: number = 0;
    isDisabled: boolean = false;
    private numberOfClues: number = 3;

    constructor(private readonly clueService: CluesService) {}

    @HostListener('window: keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        if (event.key === 'i') {
            if (!this.isDisabled) {
                this.getClue();
            }
        }
    }

    getClue() {
        this.clueAskedCounter++;
        this.clueCounter.emit(this.clueAskedCounter);
        if (this.clueAskedCounter === this.numberOfClues) {
            this.isDisabled = true;
        }
    }
}
