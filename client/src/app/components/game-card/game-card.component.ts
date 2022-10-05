import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { TimeFormatter } from '@app/classes/time-formatter';
import { GameCard } from '@app/interfaces/game-card';
import { CommunicationService } from '@app/services/communication/communication.service';
import { Score } from '@common/score';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-game-card',
    templateUrl: './game-card.component.html',
    styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent implements OnInit {
    @Input() gameCard: GameCard;
    favoriteTheme: string = 'deeppurple-amber-theme';
    imageData$: Observable<HttpResponse<{ width: number; height: number; data: number[] }>>;
    imageSrc: string;

    constructor(private readonly communicationService: CommunicationService) {}

    ngOnInit() {
        this.getImageName();
    }

    getImageName() {
        this.imageData$ = this.communicationService.getImgData(this.gameCard.gameInformation.idOriginalBmp);
        this.imageData$.subscribe((response: HttpResponse<{ width: number; height: number; data: number[] }> | null) => {
            if (!response || !response.body) {
                return;
            }

            const canvas = document.createElement('canvas');
            canvas.width = response.body.width;
            canvas.height = response.body.height;
            const ctx = canvas.getContext('2d');
            const image: ImageData = new ImageData(new Uint8ClampedArray(response.body.data), response.body.width, response.body.height, {
                colorSpace: 'srgb',
            });

            ctx?.putImageData(image, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg');
            this.imageSrc = dataUrl.replace(/^data:image\/(png|jpg);base64,/, '');
        });
    }

    formatScoreTime(scoreTime: number): string {
        return TimeFormatter.getMMSSFormat(scoreTime);
    }

    getGameName(): string {
        return this.gameCard.gameInformation.name;
    }

    isAdminCard(): boolean {
        return this.gameCard.isAdminCard;
    }

    getMultiplayerScores(): Score[] {
        return this.gameCard.gameInformation.multiplayerScore;
    }

    getSinglePlayerScores(): Score[] {
        return this.gameCard.gameInformation.soloScore;
    }

    hasMultiplayerScores(): boolean {
        return this.gameCard.gameInformation.multiplayerScore.length > 0;
    }

    hasSinglePlayerScores(): boolean {
        return this.gameCard.gameInformation.soloScore.length > 0;
    }
}
