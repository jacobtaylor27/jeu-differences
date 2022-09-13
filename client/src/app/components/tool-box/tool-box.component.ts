import { Component, EventEmitter, Output } from '@angular/core';
import { Tool } from '@app/constant/tool';

@Component({
    selector: 'app-tool-box',
    templateUrl: './tool-box.component.html',
    styleUrls: ['./tool-box.component.scss'],
})
export class ToolBoxComponent {
    @Output() userCanvasStateEvent: EventEmitter<Tool> = new EventEmitter<Tool>();
    @Output() changeColorEvent: EventEmitter<string> = new EventEmitter<string>();
    tool = Tool;
}
