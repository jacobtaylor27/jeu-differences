import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-tool-box',
    templateUrl: './tool-box.component.html',
    styleUrls: ['./tool-box.component.scss'],
})
export class ToolBoxComponent {
    @Output() switchToEraseCanvasEvent: EventEmitter<void> = new EventEmitter<void>();
    @Output() switchToPensilCanvasEvent: EventEmitter<void> = new EventEmitter<void>();
    @Output() changeColorEvent: EventEmitter<void> = new EventEmitter<void>();
}
