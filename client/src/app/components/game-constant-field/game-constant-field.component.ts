import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-game-constant-field',
    templateUrl: './game-constant-field.component.html',
    styleUrls: ['./game-constant-field.component.scss'],
})
export class GameConstantFieldComponent {
    @Input() value: number;
    @Input() label: string;
    @Input() min: number;
    @Input() max: number;
    @Input() step: number;

    togglePlus(): void {
        if (this.value < this.max) {
            this.value += this.step;
        }
    }

    toggleMinus(): void {
        if (this.value > this.min) {
            this.value -= this.step;
        }
    }
}
