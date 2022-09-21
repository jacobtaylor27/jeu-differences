import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserNameInputComponent } from '@app/components/user-name-input/user-name-input.component';

@Injectable({
  providedIn: 'root'
})
export class GameCardService {
  constructor(private readonly matDialog: MatDialog) { }

  openUseNameInputDialog(): void {
    this.matDialog.open(UserNameInputComponent);
  }
}
