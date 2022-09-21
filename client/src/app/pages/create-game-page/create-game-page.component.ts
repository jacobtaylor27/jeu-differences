import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormsErrorComponent } from '@app/components/dialog-forms-error/dialog-forms-error.component';
import { Tool } from '@app/enums/tool';
import { Vec2 } from '@app/interfaces/vec2';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

@Component({
    selector: 'app-create-game-page',
    templateUrl: './create-game-page.component.html',
    styleUrls: ['./create-game-page.component.scss'],
})
export class CreateGamePageComponent implements AfterViewInit {
    @ViewChild('sourceImg', { static: false }) sourceImg!: ElementRef<HTMLCanvasElement>;
    form: FormGroup;
    imgSourceLink: string;
    pencil: string = '#0000';
    tool: Tool = Tool.Pencil;
    size: Vec2 = { x: 480, y: 640 };

    constructor(private toolBoxService: ToolBoxService, public dialog: MatDialog, private http: HttpClient) {
        this.form = new FormGroup({
            name: new FormControl('', Validators.required),
            expansionRadius: new FormControl(3, Validators.required),
            img: new FormControl(null, [Validators.required, this.differenceValidator()]),
            imgDiff: new FormControl(null, [Validators.required, this.differenceValidator()]),
        });
    }

    ngAfterViewInit(): void {
        this.toolBoxService.$uploadImageInSource.subscribe((newImage: ImageBitmap) => {
            this.sourceImg.nativeElement.getContext('2d')?.drawImage(newImage, 0, 0);
        });
    }
    differenceValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const numberDifference = this.calculateDifference();
            const difference: Vec2 = { x: 2, y: 10 };
            return numberDifference < difference.y && numberDifference > difference.x ? { difference: { value: control.value } } : null;
        };
    }

    calculateDifference() {
        // remove this line and add the validation function when is done
        const difference = 5;
        return difference;
    }

    // set submit function but it will be done with the route
    onSubmit() {
        if (!this.form.valid) {
            const errorsMessages = Object.entries(this.form.controls)
                .filter(([, control]) => !control.valid)
                .map(([name]) => name + ' is not valid');
            this.dialog.open(DialogFormsErrorComponent, { data: { formTitle: 'Create Game Form', errorMessages: errorsMessages } });
            return;
        }
        const game = {
            name: (this.form.get('name') as FormControl).value,
            expansionRadius: (this.form.get('expansionRadius') as FormControl).value,
            img: (this.form.get('img') as FormControl).value,
            imgDiff: (this.form.get('imgDiff') as FormControl).value,
        };

        this.http.post('', game);
    }
}
