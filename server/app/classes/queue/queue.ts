import { Coordinate } from '@common/coordinate';

export class Queue {
    private array: Coordinate[] = [];

    add(data: Coordinate): void {
        this.array.push(data);
    }

    remove(): Coordinate | undefined {
        if (this.isEmpty()) throw new Error('EmptyQueueException');

        return this.array.shift();
    }

    peek(): Coordinate {
        if (this.isEmpty()) throw new Error('EmptyQueueException');

        return this.array[0];
    }

    isEmpty(): boolean {
        return this.array.length === 0;
    }
}
