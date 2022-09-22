import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PropagateCanvasEvent } from '@app/enums/propagate-canvas-event';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

@Component({
    selector: 'app-dialog-reset',
    templateUrl: './dialog-reset.component.html',
    styleUrls: ['./dialog-reset.component.scss'],
})
export class DialogResetComponent {
    form: FormGroup;
    typePropagateCanvasEvent: typeof PropagateCanvasEvent = PropagateCanvasEvent;

    constructor(private toolService: ToolBoxService) {
        this.form = new FormGroup({
            reset: new FormControl('', Validators.required),
        });
    }
    onSubmit() {
        switch ((this.form.get('reset') as FormControl).value) {
            case this.typePropagateCanvasEvent.Both: {
                this.toolService.$resetDiff.next();
                this.toolService.$resetSource.next();
                break;
            }
            case this.typePropagateCanvasEvent.Difference: {
                this.toolService.$resetDiff.next();
                break;
            }
            case this.typePropagateCanvasEvent.Source: {
                this.toolService.$resetSource.next();
                break;
            }
            default: {
                return;
            }
        }
    }
}
