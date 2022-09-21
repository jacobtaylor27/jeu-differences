import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TimeFormatter } from '@app/classes/time-formatter';
import { GameCard } from '@app/interfaces/game-card';
import { GameSelectionService } from '@app/services/game-selection.service';

@Component({
    selector: 'app-game-selection-page',
    templateUrl: './game-selection-page.component.html',
    styleUrls: ['./game-selection-page.component.scss'],
})
export class GameSelectionPageComponent implements OnInit {
    @ViewChild('enterNameDialogContentRef')
    private readonly enterNameDialogContentRef: TemplateRef<HTMLElement>;

    gameCards: GameCard[] = [];
    favoriteTheme: string = 'deeppurple-amber-theme';

    constructor(readonly gameSelectionService: GameSelectionService, private readonly matDialog: MatDialog) {}

    ngOnInit(): void {
        this.getGameCards();
        for (let i = 0; i < this.gameCards.length; i++) {
            this.gameCards[i].isAdminCard = false;
        }
    }

    hasCardsBefore(): boolean {
        return this.gameSelectionService.hasPreviousCards();
    }

    hasCardsAfter(): boolean {
        return this.gameSelectionService.hasNextCards();
    }

    getGameCards(): void {
        this.gameCards = this.gameSelectionService.getActiveCards();
    }

    getShownGameCards(): GameCard[] {
        return this.gameCards.filter((gameCard) => gameCard.isShown);
    }

    onClickPrevious(): void {
        this.gameSelectionService.showPreviousFour();
        this.getGameCards();
    }

    onClickNext(): void {
        this.gameSelectionService.showNextFour();
        this.getGameCards();
    }

    onSelectPlayGame(): void {
        this.matDialog.open(this.enterNameDialogContentRef);
    }

    onSelectCreateGame(): void {
        this.matDialog.open(this.enterNameDialogContentRef);
    }

    formatScoreTime(scoreTime: number): string {
        return TimeFormatter.getMMSSFormat(scoreTime);
    }
}
