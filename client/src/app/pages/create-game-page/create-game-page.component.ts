import { HttpClient, HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateGameComponent } from '@app/components/dialog-create-game/dialog-create-game.component';
import { DialogFormsErrorComponent } from '@app/components/dialog-forms-error/dialog-forms-error.component';
import { SIZE } from '@app/constants/canvas';
import { VALID_GAME } from '@app/constants/server';
import { Canvas } from '@app/enums/canvas';
import { Theme } from '@app/enums/theme';
import { Vec2 } from '@app/interfaces/vec2';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { catchError, of } from 'rxjs';

@Component({
    selector: 'app-create-game-page',
    templateUrl: './create-game-page.component.html',
    styleUrls: ['./create-game-page.component.scss'],
})
export class CreateGamePageComponent implements AfterViewInit {
    @ViewChild('sourceImg', { static: false }) sourceImg!: ElementRef<HTMLCanvasElement>;

    form: FormGroup;
    theme: typeof Theme = Theme;
    imageDifference: ImageData = new ImageData(Canvas.WIDTH, Canvas.HEIGHT);

    constructor(private toolBoxService: ToolBoxService, public dialog: MatDialog, private drawService: DrawService, private http: HttpClient) {
        this.form = new FormGroup({
            expansionRadius: new FormControl(3, Validators.required),
        });
    }

    ngAfterViewInit(): void {
        this.toolBoxService.$uploadImageInSource.subscribe((newImage: ImageBitmap) => {
            this.sourceImg.nativeElement.getContext('2d')?.drawImage(newImage, 0, 0);
        });
        this.toolBoxService.$resetSource.subscribe(() => {
            (this.sourceImg.nativeElement.getContext('2d') as CanvasRenderingContext2D).clearRect(0, 0, SIZE.y, SIZE.x);
        });
        this.drawService.$differenceImage.subscribe((newImageDifference: ImageData) => {
            this.imageDifference = newImageDifference;
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

    async createSourceImageFromCanvas(): Promise<ImageBitmap> {
        return await createImageBitmap(this.sourceImg.nativeElement);
    }

    manageErrorInForm(validationImageErrors: string) {
        this.dialog.open(DialogFormsErrorComponent, {
            data: { formTitle: 'Create Game Form', errorMessages: [validationImageErrors] },
        });
    }

    validateForm(nbDifference: number, differenceImage: ImageData) {
        this.dialog.open(DialogCreateGameComponent, {
            data: {
                expansionRadius: (this.form.get('expansionRadius') as FormControl).value,
                src: this.createSourceImageFromCanvas(),
                difference: this.imageDifference,
                nbDifference,
                differenceImage,
            },
        });
    }

    // set submit function but it will be done with the route
    async onSubmit() {
        this.isGameValid();
    }
}
