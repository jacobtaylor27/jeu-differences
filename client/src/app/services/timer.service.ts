import { Injectable } from '@angular/core';
// import { CommunicationService } from '@app/services/communication.service';
// import { Message } from '@common/message';
// import { BehaviorSubject } from 'rxjs';
// import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class TimerService {
    // message: BehaviorSubject<string> = new BehaviorSubject<string>('');
    // constructor(private readonly communicationService: CommunicationService) {
    //     this.getTimerFromServer();
    // }
    // getTimerFromServer(): void {
    //     this.communicationService
    //         .getTimeValue()
    //         // Cette étape transforme l'objet Message en un seul string
    //         .pipe(
    //             map((message: Message) => {
    //                 return ` ${message.body}`;
    //             }),
    //         )
    //         .subscribe(this.message);
    //     console.log('UO' + this.message.getValue());
    // }
}
