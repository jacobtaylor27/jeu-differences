import { Component } from '@angular/core';

@Component({
  selector: 'app-user-name-input',
  templateUrl: './user-name-input.component.html',
  styleUrls: ['./user-name-input.component.scss']
})
export class UserNameInputComponent {
  constructor() { }

  favoriteTheme: string = 'deeppurple-amber-theme';
  name:string;
}
