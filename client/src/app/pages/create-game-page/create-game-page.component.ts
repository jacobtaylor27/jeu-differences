import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormsErrorComponent } from '@app/components/dialog-forms-error/dialog-forms-error.component';
import { Tool } from '@app/constant/tool';
import { Vec2 } from '@app/interfaces/vec2';

@Component({
    selector: 'app-create-game-page',
    templateUrl: './create-game-page.component.html',
    styleUrls: ['./create-game-page.component.scss'],
})
export class CreateGamePageComponent {
    form: FormGroup;
    imgSourceLink: string;
    pencil: string = '#0000';
    tool: Tool = Tool.Pencil;
    size: Vec2 = { x: 480, y: 640 };

    constructor(public dialog: MatDialog, private http: HttpClient) {
        this.form = new FormGroup({
            name: new FormControl('', Validators.required),
            expansionRadius: new FormControl(3, Validators.required),
            img: new FormControl(null, [Validators.required, this.sizeImgValidator(this.size.x, this.size.y), this.differenceValidator()]),
            imgDiff: new FormControl(null, [Validators.required, this.sizeImgValidator(this.size.x, this.size.y), this.differenceValidator()]),
        });
    }

    sizeImgValidator(width: number, height: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            return control.value.height === height && control.value.width === width ? { sizeImg: { value: control.value } } : null;
        };
    }

    differenceValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const numberDifference = 5; // remove this line and add the validation function when is done
            const difference: Vec2 = { x: 2, y: 10 };
            return numberDifference < difference.y && numberDifference > difference.x ? { difference: { value: control.value } } : null;
        };
    }

    // set submit function but it will be done with the route
    onSubmit() {
        const game = {
            name: this.form.get('name')?.value,
            expansionRadius: this.form.get('expansionRadius')?.value,
            img: this.form.get('img')?.value,
            imgDiff: this.form.get('imgDiff')?.value,
        };

        this.http.post('', game);
    }
}
