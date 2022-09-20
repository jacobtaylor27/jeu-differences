import { Component, OnInit } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { GameSelectionService } from '@app/services/game-selection.service';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
    constructor(readonly gameSelectionService: GameSelectionService) {}

    favoriteTheme: string = 'deeppurple-amber-theme';
    gameCards: GameCard[] = [];

    ngOnInit(): void {
        this.getGameCards();
    }

    getGameCards(): void {
        this.gameCards = this.gameSelectionService.getActiveCards();
        for (let gameCard of this.gameCards) {
            gameCard.isAdminCard = true;
        }
    }
}
