import { Component, HostListener, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-user-name-input',
    templateUrl: './user-name-input.component.html',
    styleUrls: ['./user-name-input.component.scss'],
})
export class UserNameInputComponent {
    isMulti: boolean;
    playerName: string;
    favoriteTheme: string = 'deeppurple-amber-theme';

    // eslint-disable-next-line max-params
    constructor(
        private readonly dialogRef: MatDialogRef<UserNameInputComponent>,
        private readonly gameInformationHandlerService: GameInformationHandlerService,
        private communicationSocketService: CommunicationSocketService,
        private readonly router : Router,
        @Inject(MAT_DIALOG_DATA) private data: { isMulti: boolean },
    ) {
        this.isMulti = this.data.isMulti;
    }

    @HostListener('window:keyup', ['$event'])
    onDialogClick(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.onClickContinue();
        }
    }

    onClickContinue(): void {
        if (this.isValidName()) {
            this.gameInformationHandlerService.setPlayerName(this.playerName);
            this.dialogRef.close(true);
            if(!this.isMulti){
                this.communicationSocketService.send(SocketEvent.CreateGame, {
                    player: this.playerName,
                    mode: this.gameInformationHandlerService.gameMode,
                    game: { card: this.gameInformationHandlerService.getId(), isMulti: this.isMulti },
                });
            }

            this.router.navigate(['/waiting']);
           
        }
    }

    isValidName(): boolean {
        this.playerName = this.playerName.trim();
        return this.playerName !== undefined && this.playerName !== '';
    }
}
