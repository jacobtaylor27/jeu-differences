import { Injectable } from '@angular/core';
import { Command } from '@app/interfaces/command';

@Injectable({
    providedIn: 'root',
})
export class CommandHeapService {
    // Having an index of -1 makes way more sens, because the default index is out of bound.
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    indexOfCommand: number = -1;
    commands: Command[] = [];
    
}
