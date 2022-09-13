import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-tool-box',
    templateUrl: './tool-box.component.html',
    styleUrls: ['./tool-box.component.scss'],
})
export class ToolBoxComponent {
    @Output() userCanvasStateEvent: EventEmitter<void> = new EventEmitter<void>();
    @Output() changeColorEvent: EventEmitter<string> = new EventEmitter<string>();
}
