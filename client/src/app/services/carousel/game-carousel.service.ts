import { Injectable } from '@angular/core';
import { CarouselInformation } from '@common/carousel-information';

@Injectable({
    providedIn: 'root',
})
export class GameCarouselService {
    carouselInformation: CarouselInformation;

    setCarouselInformation(carouselInfo: CarouselInformation): void {
        this.carouselInformation = carouselInfo;
    }

    getNumberOfCards(): number {
        return this.carouselInformation.nbOfGames;
    }

    hasMoreThanOneCard(): boolean {
        return this.carouselInformation.nbOfGames > 1;
    }

    hasCards(): boolean {
        return this.carouselInformation.nbOfGames > 0;
    }

    hasPreviousCards(): boolean {
        return this.carouselInformation.hasPrevious;
    }

    hasNextCards(): boolean {
        return this.carouselInformation.hasNext;
    }
}
