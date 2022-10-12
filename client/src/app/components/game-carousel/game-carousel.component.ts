import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameInfo } from '@common/game-info';

@Component({
    selector: 'app-game-carousel',
    templateUrl: './game-carousel.component.html',
    styleUrls: ['./game-carousel.component.scss'],
})
export class GameCarouselComponent implements OnInit {
    @Input() isAdmin: boolean = false;
    gameCards: GameCard[] = [];
    favoriteTheme: string = 'deeppurple-amber-theme';

    constructor(private readonly gameCarouselService: GameCarouselService, readonly communicationService: CommunicationService) {}

    ngOnInit(): void {
        this.fetchGameInformation();
    }

    fetchGameInformation(): void {
        this.communicationService.getAllGameInfos().subscribe((response: HttpResponse<{ games: GameInfo[] }>) => {
            if (response && response.body) {
                for (const gameInfo of response.body.games) {
                    const newCard: GameCard = {
                        gameInformation: gameInfo,
                        isAdminCard: this.isAdmin,
                        isShown: false,
                    };
                    this.gameCards.push(newCard);
                }
                this.gameCarouselService.setCards(this.gameCards);
                this.resetStartingRange();
            }
        });
    }

    hasCards(): boolean {
        return this.gameCarouselService.hasCards();
    }

    resetStartingRange(): void {
        this.gameCarouselService.resetRange();
    }

    onClickPrevious(): void {
        this.gameCarouselService.showPreviousFour();
    }

    onClickNext(): void {
        this.gameCarouselService.showNextFour();
    }

    hasCardsBefore(): boolean {
        return this.gameCarouselService.hasPreviousCards();
    }

    hasCardsAfter(): boolean {
        return this.gameCarouselService.hasNextCards();
    }
}
