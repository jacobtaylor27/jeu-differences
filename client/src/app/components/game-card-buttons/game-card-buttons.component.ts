import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameCard } from '@app/interfaces/game-card';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { RouterService } from '@app/services/router-service/router.service';
import { SocketEvent } from '@common/socket-event';
import { UserNameInputComponent } from '@app/components/user-name-input/user-name-input.component';

@Component({
    selector: 'app-game-card-buttons',
    templateUrl: './game-card-buttons.component.html',
    styleUrls: ['./game-card-buttons.component.scss'],
})
export class GameCardButtonsComponent {
    @Input() gameCard: GameCard;

    // eslint-disable-next-line max-params -- absolutely need all the imported services
    constructor(
        private readonly gameInfoHandlerService: GameInformationHandlerService,
        private readonly socketService: CommunicationSocketService,
        private readonly router: RouterService,
        private readonly matDialog: MatDialog,
        private readonly communicationService: CommunicationService,
    ) {}

    isMultiplayer(): boolean {
        return this.gameCard.isMulti;
    }

    onClickDeleteGame(game: GameCard): void {
        this.communicationService.deleteGame(game.gameInformation.id).subscribe({
            next: () => {
                this.socketService.send(SocketEvent.GameDeleted, { gameId: game.gameInformation.id });
                this.router.reloadPage('admin');
            },
            error: () => {
                this.router.redirectToErrorPage();
            },
        });
    }

    onClickPlayGame(): void {
        this.gameInfoHandlerService.setGameInformation(this.gameCard.gameInformation);
        this.gameInfoHandlerService.isMulti = false;
        this.openNameDialog();
    }

    onClickCreateJoinGame(): void {
        this.gameInfoHandlerService.setGameInformation(this.gameCard.gameInformation);
        this.gameInfoHandlerService.isMulti = true;
        this.openNameDialog(true);
    }

    onClickRefreshGame(): void {
        this.communicationService.refreshSingleGame(this.gameCard.gameInformation.id).subscribe({
            next: () => {
                this.router.reloadPage('admin');
            },
            error: () => {
                this.router.redirectToErrorPage();
            },
        });
    }

    private openNameDialog(isMulti: boolean = false): void {
        this.matDialog.open(UserNameInputComponent, { data: { isMulti } });
    }
}
