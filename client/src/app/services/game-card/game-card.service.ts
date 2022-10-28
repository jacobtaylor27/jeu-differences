import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserNameInputComponent } from '@app/components/user-name-input/user-name-input.component';
import { CommunicationService } from '@app/services/communication/communication.service';

@Injectable({
    providedIn: 'root',
})
export class GameCardService {
    constructor(private readonly matDialog: MatDialog, private readonly communicationService: CommunicationService) {}

    openNameDialog(isMulti: boolean = false) {
        this.matDialog.open(UserNameInputComponent, { data: { isMulti } });
    }

    deleteGame(id: string) {
        this.communicationService.deleteGame(id).subscribe();
    }

    // resetHighScores(id: string) {}
}
