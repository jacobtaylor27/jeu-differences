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
                { x: DEFAULT_IMAGE_WIDTH / 2, y: 0 },
                { x: DEFAULT_IMAGE_WIDTH / 2, y: DEFAULT_IMAGE_HEIGHT / 2 },
            ];
        }
        if (this.isInSecondQuadrant(coord)) {
            return [
                { x: 0, y: 0 },
                { x: DEFAULT_IMAGE_WIDTH / 2, y: DEFAULT_IMAGE_HEIGHT / 2 },
            ];
        }
        if (this.isInThirdQuadrant(coord)) {
            return [
                { x: 0, y: DEFAULT_IMAGE_HEIGHT / 2 },
                { x: DEFAULT_IMAGE_WIDTH / 2, y: DEFAULT_IMAGE_HEIGHT },
            ];
        }
        return [
            { x: DEFAULT_IMAGE_WIDTH / 2, y: DEFAULT_IMAGE_HEIGHT / 2 },
            { x: DEFAULT_IMAGE_WIDTH, y: DEFAULT_IMAGE_HEIGHT },
        ];
    }

    secondCluePosition(coord: Coordinate) {
        return coord;
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

    private isInFirstQuadrant(coord: Coordinate, leftUpperCoord: Coordinate, rightBottomCoord: Coordinate) {
        return this.isToTheRight(coord, leftUpperCoord.x, rightBottomCoord.x) && this.isOnTop(coord, leftUpperCoord.y, rightBottomCoord.y);
    }

    private isInSecondQuadrant(coord: Coordinate, leftUpperCoord: Coordinate, rightButtomCoord: Coordinate) {
        return !this.isToTheRight(coord, leftUpperCoord.x, rightButtomCoord.x) && this.isOnTop(coord, leftUpperCoord.y, rightButtomCoord.y);
    }

    private isInThirdQuadrant(coord: Coordinate, leftUpperCoord: Coordinate, rightBottomCoord: Coordinate) {
        return !this.isToTheRight(coord, leftUpperCoord.x, rightBottomCoord.x) && !this.isOnTop(coord, leftUpperCoord.y, rightBottomCoord.y);
    }
}
