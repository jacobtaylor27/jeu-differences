import { Component } from '@angular/core';
import { CommunicationService } from '@app/services/communication.service';
import { Message } from '@common/message';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    favoriteTheme: string = 'deeppurple-amber-theme';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');
    gameModeLimitedTime: boolean = false;

    constructor(private readonly communicationService: CommunicationService) {
        if (this.gameModeLimitedTime) {
            this.getTimerValue();
        }
    }

    getTimerValue(): void {
        this.communicationService
            .getTimeValue()
            // Cette étape transforme l'objet Message en un seul string
            .pipe(
                map((message: Message) => {
                    return ` ${message.body}`;
                }),
            )
            .subscribe(this.message);
    }
}
