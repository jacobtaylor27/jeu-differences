import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-dialog-forms-error',
    templateUrl: './dialog-forms-error.component.html',
    styleUrls: ['./dialog-forms-error.component.scss'],
})
export class DialogFormsErrorComponent {
    @Input() formTitle: string;
    @Input() errorMessages: string[];
}
