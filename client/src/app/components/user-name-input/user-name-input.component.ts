import { Component, Output } from '@angular/core';

@Component({
    selector: 'app-user-name-input',
    templateUrl: './user-name-input.component.html',
    styleUrls: ['./user-name-input.component.scss'],
})
export class UserNameInputComponent {
    @Output() name: string;
    favoriteTheme: string = 'deeppurple-amber-theme';
}