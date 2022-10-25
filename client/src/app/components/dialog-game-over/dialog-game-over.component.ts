import { Component } from '@angular/core';
import { Theme } from '@app/enums/theme';

@Component({
    selector: 'app-dialog-game-over',
    templateUrl: './dialog-game-over.component.html',
    styleUrls: ['./dialog-game-over.component.scss'],
})
export class DialogGameOverComponent {
    theme = Theme.ClassName;
}
