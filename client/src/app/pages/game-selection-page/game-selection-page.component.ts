import { Component, OnInit } from '@angular/core';
import { TimeFormatter } from '@app/classes/time-formatter';
import { GameCard } from '@app/interfaces/game-card';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';
import { CommunicationService } from '@app/services/communication.service';

@Component({
    selector: 'app-game-selection-page',
    templateUrl: './game-selection-page.component.html',
    styleUrls: ['./game-selection-page.component.scss'],
})
export class GameSelectionPageComponent implements OnInit {
    gameCards: GameCard[] = [];
    favoriteTheme: string = 'deeppurple-amber-theme';

    constructor(readonly gameCarouselService: GameCarouselService, readonly communicationService: CommunicationService) {
        this.fetchImgData();
    }

    ngOnInit(): void {
        this.gameCards = this.gameCarouselService.getCards();
        this.makeCardsSelectMode();
    }

    // ngAfterViewInit(): void {
    //     console.log(this.fetchImgData());
    // }

    getNumberOfGames(): number {
        return this.gameCarouselService.getCarouselLength();
    }

    hasGames(): boolean {
        return this.gameCarouselService.hasCards();
    }

    makeCardsSelectMode(): void {
        this.gameCarouselService.setCardMode();
    }

    formatScoreTime(scoreTime: number): string {
        return TimeFormatter.getMMSSFormat(scoreTime);
    }

    fetchImgData() {
        console.log('this is called');
        this.communicationService.getImgData('hello').subscribe((imgData) => {
            console.log(imgData);
        });
    }
}
