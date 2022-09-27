import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-game-constant-field',
    templateUrl: './game-constant-field.component.html',
    styleUrls: ['./game-constant-field.component.scss'],
})
export class GameConstantFieldComponent {
    @Input() value: number;
    @Input() label: string;

    constructor() {
        // eslint-disable-next-line no-console
        console.log('GameConstantFieldComponent constructor');
    }
}
