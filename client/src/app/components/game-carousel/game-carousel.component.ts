import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Theme } from '@app/enums/theme';
import { CarouselResponse } from '@app/interfaces/carousel-response';
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
    favoriteTheme: string = Theme.ClassName;

    constructor(private readonly gameCarouselService: GameCarouselService, readonly communicationService: CommunicationService) {}

    get isInformationLoaded(): boolean {
        return this.isLoaded;
    }

    ngOnInit(): void {
        this.fetchFirstFourCards();
    }

    // fetchGameInformation(): void {
    //     this.communicationService.getAllGameInfos().subscribe((response: HttpResponse<{ games: PublicGameInformation[] }>) => {
    //         if (response && response.body) {
    //             for (const gameInfo of response.body.games) {
    //                 const newCard: GameCard = {
    //                     gameInformation: gameInfo,
    //                     isAdminCard: this.isAdmin,
    //                     isShown: false,
    //                     isMulti: false,
    //                 };
    //                 this.gameCards.push(newCard);
    //             }
    //             this.gameCarouselService.setCards(this.gameCards);
    //             this.isLoaded = true;
    //         }
    //     });
    // }

    fetchFirstFourCards(): void {
        this.communicationService.getGamesInfoByPage(1).subscribe((response: HttpResponse<{ carouselRange: CarouselResponse }>) => {
            if (response && response.body) {
                this.setGameCards(response.body.carouselRange.games);
                this.isLoaded = true;
            }
        });
    }

    setGameCards(games: PublicGameInformation[]): void {
        for (const gameInfo of games) {
            this.gameCards.push({
                gameInformation: gameInfo,
                isAdminCard: this.isAdmin,
                isShown: false,
                isMulti: false,
            });
        }
        this.gameCarouselService.setCards(this.gameCards);
    }

    getCardsCount(): number {
        return this.gameCarouselService.getNumberOfCards();
    }

    hasMoreThanOneCard(): boolean {
        return this.gameCarouselService.hasMoreThanOneCard();
    }

    hasCards(): boolean {
        return this.gameCarouselService.hasCards();
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
