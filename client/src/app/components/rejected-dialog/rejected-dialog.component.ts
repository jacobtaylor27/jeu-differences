import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-rejected-dialog',
  templateUrl: './rejected-dialog.component.html',
  styleUrls: ['./rejected-dialog.component.scss']
})
export class RejectedDialogComponent {
  @Input() reason : string;
  favoriteTheme: string = 'deeppurple-amber-theme';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
       reason : string;
    }){ this.reason = data.reason}
}
