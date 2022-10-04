import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    favoriteTheme: string = 'deeppurple-amber-theme';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');

    // constructor(private readonly communicationService: CommunicationService) {
    //     this.getTimerValue();
    // }

    // getTimerValue(): void {
    //     this.communicationService
    //         .getTimeValue()
    //         // Cette étape transforme l'objet Message en un seul string
    //         .pipe(
    //             map((message: Message) => {
    //                 return ` ${message.body}`;
    //             }),
    //         )
    //         .subscribe((timer: string) => {
    //             this.message.next(timer);
    //         });
    // }
}
