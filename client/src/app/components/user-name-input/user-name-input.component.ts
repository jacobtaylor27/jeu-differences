import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Theme } from '@app/enums/theme';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { SocketEvent } from '@common/socket-event';
import { DialogLimitedTimeComponent } from '@app/components/dialog-limited-time/dialog-limited-time.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-user-name-input',
    templateUrl: './user-name-input.component.html',
    styleUrls: ['./user-name-input.component.scss'],
})
export class UserNameInputComponent {
    isMulti: boolean;
    playerName: string;
    form: FormGroup = new FormGroup({ name: new FormControl('', [this.noWhiteSpaceValidator, Validators.required]) });
    favoriteTheme: string = Theme.ClassName;

    // eslint-disable-next-line max-params -- absolutely need all the imported services
    constructor(
        private readonly dialogRef: MatDialogRef<UserNameInputComponent>,
        private readonly gameInformationHandlerService: GameInformationHandlerService,
        private communicationSocketService: CommunicationSocketService,
        private readonly matDialog: MatDialog,
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
        this.gameInformationHandlerService.resetPlayers();
        if (this.isValidName()) {
            this.gameInformationHandlerService.setPlayerName(this.playerName);
            this.dialogRef.close(true);

            if (this.gameInformationHandlerService.isLimitedTime()) {
                this.openGameModeDialog();
                return;
            }
            if (!this.isMulti) {
                this.communicationSocketService.send(SocketEvent.CreateGame, {
                    player: this.playerName,
                    mode: this.gameInformationHandlerService.gameMode,
                    game: { card: this.gameInformationHandlerService.getId(), isMulti: this.isMulti },
                });
                this.gameInformationHandlerService.handleSocketEvent();
                return;
            }

            this.communicationSocketService.send(SocketEvent.CreateGameMulti, {
                player: this.playerName,
                mode: this.gameInformationHandlerService.gameMode,
                game: { card: this.gameInformationHandlerService.getId(), isMulti: this.isMulti },
            });
            this.gameInformationHandlerService.handleSocketEvent();
        }
    }

    isValidName(): boolean {
        this.playerName = this.playerName.trim();
        return this.playerName !== undefined && this.playerName !== '';
    }

    openGameModeDialog() {
        this.matDialog.open(DialogLimitedTimeComponent);
    }
}
