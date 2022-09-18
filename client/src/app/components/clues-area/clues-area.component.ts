import { Component, HostListener } from '@angular/core';

@Component({
    selector: 'app-clues-area',
    templateUrl: './clues-area.component.html',
    styleUrls: ['./clues-area.component.scss'],
})
export class CluesAreaComponent {
    private numberOfClues: number = 3;
    clueAskedCounter: number = 0;
    isDisabled: boolean = false;

    @HostListener('window: keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        if (event.key === 'i') {
            this.getClue();
        }
    }

    getClue() {
        this.clueAskedCounter++;
        if (this.clueAskedCounter === this.numberOfClues) {
            this.isDisabled = true;
        }
        // TODO add logic
    }
}
