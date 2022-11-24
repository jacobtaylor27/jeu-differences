import { PrivateGameInformation } from '@app/interface/game-info';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { Coordinate } from '@common/coordinate';
import { DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH } from '@common/image-size';
import { Service } from 'typedi';
@Service()
export class CluesService {
    laurie: boolean = true;
    constructor(private readonly gameManager: GameManagerService) {}

    findRandomDifference(gameId: string): Coordinate[] | undefined {
        const info = this.gameManager.getGameInfo(gameId) as PrivateGameInformation;
        const gameDifferences = info.differences as Coordinate[][];
        return gameDifferences[this.findRandomIndex(gameDifferences.length)];
    }

    findRandomPixel(gameId: string): Coordinate {
        const difference: Coordinate[] = this.findRandomDifference(gameId) as Coordinate[];
        return difference[this.findRandomIndex(difference.length)];
    }

    private findRandomIndex(length: number) {
        return Math.floor(Math.random() * length);
    }

    private isToTheRight(coord: Coordinate, minValue: number, maxValue: number): boolean {
        return coord.x > minValue && coord.x > maxValue / 2;
    }

    private isOnTop(coord: Coordinate, minValue: number, maxValue: number) {
        return coord.y > minValue && coord.y < maxValue / 2;
    }

    private isInFirstQuadrant(coord: Coordinate) {
        return this.isToTheRight(coord, 0, DEFAULT_IMAGE_WIDTH) && this.isOnTop(coord, 0, DEFAULT_IMAGE_HEIGHT);
    }

    private isInSecondQuadrant(coord: Coordinate) {
        return !this.isToTheRight(coord, 0, DEFAULT_IMAGE_WIDTH) && this.isOnTop(coord, 0, DEFAULT_IMAGE_HEIGHT);
    }

    private isInThirdQuadrant(coord: Coordinate) {
        return !this.isToTheRight(coord, 0, DEFAULT_IMAGE_WIDTH) && !this.isOnTop(coord, 0, DEFAULT_IMAGE_HEIGHT);
    }

    private isInFourthQuadrant(coord: Coordinate) {
        return this.isToTheRight(coord, 0, DEFAULT_IMAGE_WIDTH) && !this.isOnTop(coord, 0, DEFAULT_IMAGE_HEIGHT);
    }
}
