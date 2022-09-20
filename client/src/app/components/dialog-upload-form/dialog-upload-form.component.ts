import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Vec2 } from '@app/interfaces/vec2';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

@Component({
    selector: 'app-dialog-upload-form',
    templateUrl: './dialog-upload-form.component.html',
    styleUrls: ['./dialog-upload-form.component.scss'],
})
export class DialogUploadFormComponent {
    size: Vec2 = { x: 480, y: 640 };
    form: FormGroup;
    isSizeImageCorrect: boolean = true;
    isTypeImageCorrect: boolean = true;
    img: ImageBitmap;
    isFormSubmitted: boolean = false;

    constructor(private toolService: ToolBoxService) {
        this.form = new FormGroup({
            type: new FormControl(null, Validators.required),
            uploadImage: new FormControl(null, Validators.required),
        });
    }
}
