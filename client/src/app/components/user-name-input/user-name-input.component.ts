import { Component, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
    playerName: string;
    favoriteTheme: string = 'deeppurple-amber-theme';

    constructor(
        private readonly router: Router,
        private readonly dialogRef: MatDialogRef<UserNameInputComponent>,
        private readonly gameInformationHandlerService: GameInformationHandlerService,
        private communicationSocketService: CommunicationSocketService,
    ) {}

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
            this.router.navigate(['/game']);
            this.communicationSocketService.send(SocketEvent.CreateGame, {
                player: this.playerName,
                mode: this.gameInformationHandlerService.gameMode,
                game: { card: this.gameInformationHandlerService.getId(), isMulti: false },
            });
        }
    }

    isValidName(): boolean {
        this.playerName = this.playerName.trim();
        return this.playerName !== undefined && this.playerName !== '';
    }
}
