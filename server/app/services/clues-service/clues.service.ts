import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { Coordinate } from '@common/coordinate';
import { DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH } from '@common/image-size';
import { Service } from 'typedi';
@Service()
export class CluesService {
    constructor(private readonly gameManager: GameManagerService) {}

    findRandomDifference(gameId: string): Coordinate[] | undefined {
        const gameDifferencesLeft: Coordinate[][] = this.gameManager.getNbDifferenceNotFound(gameId) as Coordinate[][];
        return gameDifferencesLeft[this.findRandomIndex(gameDifferencesLeft.length)];
    }

    findRandomPixel(gameId: string): Coordinate {
        const difference: Coordinate[] = this.findRandomDifference(gameId) as Coordinate[];
        return difference[this.findRandomIndex(difference.length)];
    }

    firstCluePosition(coord: Coordinate): Coordinate[] {
        if (this.isInFirstQuadrant(coord)) {
            return [
                { x: 320, y: 0 },
                { x: 640, y: 240 },
            ];
        }
        if (this.isInSecondQuadrant(coord)) {
            return [
                { x: 0, y: 0 },
                { x: 320, y: 240 },
            ];
        }
        if (this.isInThirdQuadrant(coord)) {
            return [
                { x: 0, y: 240 },
                { x: 320, y: 480 },
            ];
        }
        return [
            { x: 320, y: 240 },
            { x: 640, y: 480 },
        ];
    }

    isDifferenceFound(difference: Coordinate[]) {
        return;
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

    // private isInFourthQuadrant(coord: Coordinate) {
    //     return this.isToTheRight(coord, 0, DEFAULT_IMAGE_WIDTH) && !this.isOnTop(coord, 0, DEFAULT_IMAGE_HEIGHT);
    // }
}
