import { Component } from '@angular/core';

@Component({
  selector: 'app-game-constants-settings',
  templateUrl: './game-constants-settings.component.html',
  styleUrls: ['./game-constants-settings.component.scss']
})
export class GameConstantsSettingsComponent {
  constructor() { }

  favoriteTheme: string = 'deeppurple-amber-theme';
}
