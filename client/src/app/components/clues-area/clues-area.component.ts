import { Component } from '@angular/core';

@Component({
    selector: 'app-clues-area',
    templateUrl: './clues-area.component.html',
    styleUrls: ['./clues-area.component.scss'],
})
export class CluesAreaComponent {
    NUMBER_OF_CLUES: number = 3;
    clueAskedCounter: number = 0;
    isDisabled: boolean = false;

    getClue() {
        this.clueAskedCounter++;
        if (this.clueAskedCounter === this.NUMBER_OF_CLUES) {
            this.isDisabled = true;
        }
        // TODO add logic
    }
}
