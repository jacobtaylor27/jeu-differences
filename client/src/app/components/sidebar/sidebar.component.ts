import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    @Input() timer = '';
    @Input() askedClue: number = 0;

    onClueAsked(eventData: number) {
        this.askedClue = eventData;
    }
}
