import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { Coordinate } from '@common/coordinate';
import { DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH } from '@common/image-size';
import { Service } from 'typedi';
@Service()
export class CluesService {
    defaultLeftUpperCoord: Coordinate = { x: 0, y: 0 };
    defaultRightBottomCoord: Coordinate = { x: DEFAULT_IMAGE_WIDTH, y: DEFAULT_IMAGE_HEIGHT };

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
        return this.findQuadrant(coord, this.defaultLeftUpperCoord, this.defaultRightBottomCoord);
    }

    secondCluePosition(coord: Coordinate): Coordinate[] {
        const firstQuadrant: Coordinate[] = this.firstCluePosition(coord);
        const leftUpperCoord: Coordinate = firstQuadrant[0];
        const rightBottomCoord: Coordinate = firstQuadrant[1];
        return this.findQuadrant(coord, leftUpperCoord, rightBottomCoord);
    }

    thirdCluePosition(coord: Coordinate): Coordinate[] {
        return [coord, { x: -1, y: -1 }];
    }

    private findQuadrant(coord: Coordinate, leftUpperCoord: Coordinate, rightBottomCoord: Coordinate) {
        if (this.isInFirstQuadrant(coord, leftUpperCoord, rightBottomCoord)) {
            return [
                { x: leftUpperCoord.x + (rightBottomCoord.x - leftUpperCoord.x) / 2, y: leftUpperCoord.y },
                { x: rightBottomCoord.x, y: leftUpperCoord.y + (rightBottomCoord.y - leftUpperCoord.y) / 2 },
            ];
        }
        if (this.isInSecondQuadrant(coord, leftUpperCoord, rightBottomCoord)) {
            return [
                { x: leftUpperCoord.x, y: leftUpperCoord.y },
                {
                    x: leftUpperCoord.x + (rightBottomCoord.x - leftUpperCoord.x) / 2,
                    y: leftUpperCoord.y + (rightBottomCoord.y - leftUpperCoord.y) / 2,
                },
            ];
        }
        if (this.isInThirdQuadrant(coord, leftUpperCoord, rightBottomCoord)) {
            return [
                { x: leftUpperCoord.x, y: leftUpperCoord.y + (rightBottomCoord.y - leftUpperCoord.y) / 2 },
                { x: leftUpperCoord.x + (rightBottomCoord.x - leftUpperCoord.x) / 2, y: rightBottomCoord.y },
            ];
        }
        return [
            { x: leftUpperCoord.x + (rightBottomCoord.x - leftUpperCoord.x) / 2, y: leftUpperCoord.y + (rightBottomCoord.y - leftUpperCoord.y) / 2 },
            { x: rightBottomCoord.x, y: rightBottomCoord.y },
        ];
    }

    private findRandomIndex(length: number) {
        return Math.floor(Math.random() * length);
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

    private isToTheRight(coord: Coordinate, minValue: number, maxValue: number): boolean {
        return coord.x > minValue && coord.x > minValue + (maxValue - minValue) / 2;
    }

    private isOnTop(coord: Coordinate, minValue: number, maxValue: number) {
        return coord.y > minValue && coord.y < minValue + (maxValue - minValue) / 2;
    }
}
