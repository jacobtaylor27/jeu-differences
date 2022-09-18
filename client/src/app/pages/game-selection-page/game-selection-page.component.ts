import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
}
