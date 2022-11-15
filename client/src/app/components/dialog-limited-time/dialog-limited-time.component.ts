import { Component } from '@angular/core';
import { Theme } from '@app/enums/theme';

@Component({
  selector: 'app-dialog-limited-time',
  templateUrl: './dialog-limited-time.component.html',
  styleUrls: ['./dialog-limited-time.component.scss']
})
export class DialogLimitedTimeComponent {

  favoriteTheme: string = Theme.ClassName;

  constructor(){}

  onClickSolo(){}

  OnClickCoop(){}


}
