import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Theme } from '@app/enums/theme';
import { CarouselResponse } from '@app/interfaces/carousel-response';
import { GameCard } from '@app/interfaces/game-card';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { CarouselInformation } from '@common/carousel-information';
import { PublicGameInformation } from '@common/game-information';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-game-carousel',
    templateUrl: './game-carousel.component.html',
    styleUrls: ['./game-carousel.component.scss'],
})
export class GameCarouselComponent implements OnInit {
    @Input() isAdmin: boolean = false;
    isLoaded: boolean;
    games: GameCard[] = [];
    favoriteTheme: string = Theme.ClassName;

    constructor(private readonly gameCarouselService: GameCarouselService, 
        readonly communicationService: CommunicationService,
        private readonly socketService : CommunicationSocketService) {}

    ngOnInit(): void {
        this.getFirstPage();
        this.handleSocket();
    }

    handleSocket() : void {
        this.socketService.on(SocketEvent.RefreshGames, () => {
            this.getFirstPage();
        })
    }

    getFirstPage(): void {
        this.getPage(1);
    }

    getNextPage(): void {
        this.getPage(this.gameCarouselService.carouselInformation.currentPage + 1);
    }

    getPreviousPage(): void {
        this.getPage(this.gameCarouselService.carouselInformation.currentPage - 1);
    }

    getPage(pageNb: number): void {
        this.isLoaded = false;
        this.communicationService.getGamesInfoByPage(pageNb).subscribe((response: HttpResponse<CarouselResponse>) => {
            if (response && response.body) {
                this.setCarouselInformation(response.body.carouselInfo);
                this.setGameCards(response.body.games);
                this.isLoaded = true;
            }
        });
    }

    isInformationLoaded(): boolean {
        return this.isLoaded;
    }

    setCarouselInformation(carouselInfo: CarouselInformation): void {
        this.gameCarouselService.setCarouselInformation(carouselInfo);
    }

    setGameCards(games: PublicGameInformation[]): void {
        this.games = [];
        for (const card of games) {
            this.games.push({
                gameInformation: card,
                isAdminCard: this.isAdmin,
                isMulti: false,
            });
        }
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
        this.getPreviousPage();
    }

    onClickNext(): void {
        this.getNextPage();
    }

    hasCardsBefore(): boolean {
        return this.gameCarouselService.hasPreviousCards();
    }

    hasCardsAfter(): boolean {
        return this.gameCarouselService.hasNextCards();
    }
}
