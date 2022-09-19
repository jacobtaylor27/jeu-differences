import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
    selector: 'app-demo-upload-bmp',
    templateUrl: './demo-upload-bmp.component.html',
    styleUrls: ['./demo-upload-bmp.component.scss'],
})
export class DemoUploadBmpComponent {
    img: string;
    form: FormGroup;
    constructor() {
        this.form = new FormGroup({
            img: new FormControl(null),
        });
    }
    selectFile(event: Event) {
        const files = (event.target as HTMLInputElement).files;
        if (files === null) {
            return;
        }
        const file = files[0];
        if (file.type !== 'image/bmp') {
            return;
        }
    }
}
