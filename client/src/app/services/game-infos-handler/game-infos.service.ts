import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommunicationService } from '../communication.service';

@Injectable({
    providedIn: 'root',
})
export class GameInfosService {
    imageWidth: number;
    imageHeight: number;
    imageData: number[];
    imageName: string;
    constructor(readonly communicationService: CommunicationService) {}

    fetchImgData(id: string) {
        return this.communicationService
            .getImgData(id)
            .subscribe((response: HttpResponse<{ width: number; height: number; data: number[] }> | null) => {
                if (!response || !response.body) {
                    return;
                }
                this.imageWidth = response.body.width;
                this.imageHeight = response.body.height;
                this.imageData = response.body.data;
            });
    }
}
