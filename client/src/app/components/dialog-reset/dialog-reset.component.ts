import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

@Component({
    selector: 'app-dialog-reset',
    templateUrl: './dialog-reset.component.html',
    styleUrls: ['./dialog-reset.component.scss'],
})
export class DialogResetComponent {
    form: FormGroup;
    constructor(private toolService: ToolBoxService) {
        this.form = new FormGroup({
            reset: new FormControl('', Validators.required),
        });
    }

}
