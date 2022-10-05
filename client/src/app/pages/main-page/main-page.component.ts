import { Component } from '@angular/core';
import { MainPageService } from '@app/services/main-page/main-page.service';
import { GameMode } from '@common/game-mode';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'Jeu de différences';
    favoriteTheme: string = 'deeppurple-amber-theme';

    constructor(private readonly mainPageService: MainPageService) {}

    onClickPlayClassic(): void {
        this.mainPageService.setGameMode(GameMode.Classic);
    }

    onClickPlayLimited(): void {
        this.mainPageService.setGameMode(GameMode.LimitedTime);
    }
}
