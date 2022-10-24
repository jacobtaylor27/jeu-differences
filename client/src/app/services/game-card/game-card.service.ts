import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserNameInputComponent } from '@app/components/user-name-input/user-name-input.component';
import { CommunicationService } from '@app/services/communication/communication.service';

@Injectable({
    providedIn: 'root',
})
export class GameCardService {
    constructor(private readonly matDialog: MatDialog, private readonly communicationService: CommunicationService) {}

    openNameDialog() {
        this.matDialog.open(UserNameInputComponent);
    }

    deleteGame(id: string) {
        this.communicationService.deleteGame(id);
    }

    // resetHighScores(id: string) {}
}
