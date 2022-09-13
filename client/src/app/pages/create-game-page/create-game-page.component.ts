import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tool } from '@app/constant/tool';

@Component({
    selector: 'app-create-game-page',
    templateUrl: './create-game-page.component.html',
    styleUrls: ['./create-game-page.component.scss'],
})
export class CreateGamePageComponent {
    form: FormGroup;

    constructor() {
        this.form = new FormGroup({
            name: new FormControl('', Validators.required),
            expansionRadius: new FormControl(3, Validators.required),
            img: new FormControl(null, Validators.required),
            imgDiff: new FormControl(null, Validators.required),
        });
    }
    changeColor(color: string) {
        console.log(color);
        return;
    }

    changePensilState(tool: Tool) {
        console.log(tool);
        return;
    }
    onSubmit() {
        return;
    }
}
