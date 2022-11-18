import { Coordinate } from '@common/coordinate';

export class Queue {
    private array: Coordinate[] = [];

    add(data: Coordinate): void {
        this.array.push(data);
    }

    remove(): Coordinate | null {
        if (this.isEmpty()) return null;

        return this.array.shift() as Coordinate;
    }

    peek(): Coordinate | null {
        if (this.isEmpty()) return null;

        return this.array[0];
    }

    isEmpty(): boolean {
        return this.array.length === 0;
    }
}
