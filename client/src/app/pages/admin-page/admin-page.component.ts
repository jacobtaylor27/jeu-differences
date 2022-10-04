import { AfterViewChecked, Component } from '@angular/core';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements AfterViewChecked {
    favoriteTheme: string = 'deeppurple-amber-theme';

    constructor(private readonly gameCarouselService: GameCarouselService) {}

    ngAfterViewChecked(): void {
        this.makeCardsAdminMode();
        this.resetStartingRange();
    }

    makeCardsAdminMode(): void {
        this.gameCarouselService.setCardMode(true);
    }

    resetStartingRange(): void {
        this.gameCarouselService.resetRange();
    }
}
