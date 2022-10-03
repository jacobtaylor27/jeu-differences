import { Injectable } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { CommunicationService } from '../communication.service';

@Injectable({
    providedIn: 'root',
})
export class GameInfosService {
    constructor(readonly communicationService: CommunicationService) {}

    fetchImgData() {
        this.communicationService.getImgData('hello').subscribe((imgData) => {
            this.setImageName(imgData);

            return imgData;
        });
    }

    setInfos(gameCard: GameCard, imgName: string) {
        gameCard.gameInformation.imgName = imgName;
    }

    private setImageName(imageData: ImageData) {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        console.log(typeof imageData);
        ctx?.putImageData(imageData as ImageData, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        return dataUrl.replace(/^data:image\/(png|jpg);base64,/, '');
    }
}
