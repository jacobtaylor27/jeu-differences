import { Component } from '@angular/core';
import { PropagateCanvasEvent } from '@app/enums/propagate-canvas-event';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

@Component({
    selector: 'app-dialog-reset',
    templateUrl: './dialog-reset.component.html',
    styleUrls: ['./dialog-reset.component.scss'],
})
export class DialogResetComponent {
    typePropagateCanvasEvent: typeof PropagateCanvasEvent = PropagateCanvasEvent;
    isCanvasReset = { draw: false, compare: false };
    constructor(private toolService: ToolBoxService) {}

    onSubmit() {
        if (!this.isCanvasReset.draw && !this.isCanvasReset.compare) {
            return;
        }
        if (this.isCanvasReset.draw) {
            this.toolService.$resetDiff.next();
        }
        if (this.isCanvasReset.compare) {
            this.toolService.$resetSource.next();
        }
    }
}
