import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { PublicGameInformation } from '@common/game-information';

@Component({
    selector: 'app-game-carousel',
    templateUrl: './game-carousel.component.html',
    styleUrls: ['./game-carousel.component.scss'],
})
export class GameCarouselComponent implements OnInit {
    @Input() isAdmin: boolean = false;
    isLoaded: boolean;
    gameCards: GameCard[] = [];
    favoriteTheme: string = 'deeppurple-amber-theme';

    constructor(private readonly gameCarouselService: GameCarouselService, readonly communicationService: CommunicationService) {}

    get isInformationLoaded(): boolean {
        return this.isLoaded;
    }

    ngOnInit(): void {
        this.fetchGameInformation();
    }

    fetchGameInformation(): void {
        this.communicationService.getAllGameInfos().subscribe((response: HttpResponse<{ games: PublicGameInformation[] }>) => {
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
                this.isLoaded = true;
                this.resetStartingRange();
            }
        });
    }

    getCardsCount(): number {
        return this.gameCarouselService.getNumberOfCards();
    }

    hasMoreThanOneCard(): boolean {
        return this.gameCarouselService.getNumberOfCards() > 1;
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
