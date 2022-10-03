import { HttpClient, HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateGameComponent } from '@app/components/dialog-create-game/dialog-create-game.component';
import { DialogFormsErrorComponent } from '@app/components/dialog-forms-error/dialog-forms-error.component';
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
        const resetCanvas = () => {
            const ctx = this.sourceImg.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            ctx.rect(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
            ctx.fillStyle = 'white';
            ctx.fill();
        };

        this.toolBoxService.$resetSource.subscribe(() => resetCanvas());
        this.drawService.$differenceImage.subscribe((newImageDifference: ImageData) => {
            this.imageDifference = newImageDifference;
        });
        this.toolBoxService.$resetDiff.next();
        resetCanvas();
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

    createSourceImageFromCanvas(): ImageData {
        return (this.sourceImg.nativeElement.getContext('2d') as CanvasRenderingContext2D).getImageData(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
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

    isGameValid() {
        const original: ImageData = this.createSourceImageFromCanvas();
        return this.http
            .post<{ numberDifference: number; width: number; height: number; data: number[] }>(
                VALID_GAME,
                {
                    original: { width: original.width, height: original.height, data: Array.from(original.data) },
                    modify: { width: this.imageDifference.width, height: this.imageDifference.height, data: Array.from(this.imageDifference.data) },
                    differenceRadius: (this.form.get('expansionRadius') as FormControl).value as number,
                },
                { observe: 'response' },
            )
            .pipe(
                catchError((response: HttpErrorResponse) => {
                    switch (response.status) {
                        case HttpStatusCode.NotAcceptable:
                            if (!response.error) {
                                break;
                            }
                            this.manageErrorInForm(`Il faut entre 3 et 9 differences. Il y en a ${response.error.numberDifference}`);
                            break;
                        case HttpStatusCode.NotFound:
                            this.manageErrorInForm("La server n'as pas pu identifier les differences");
                            break;
                        case HttpStatusCode.BadRequest:
                            this.manageErrorInForm('Il manque des parametres pour pouvoir trouver les differences');
                            break;
                    }
                    return of(null);
                }),
            )
            .subscribe((response: HttpResponse<{ numberDifference: number; width: number; height: number; data: number[] }> | null) => {
                if (!response || !response.body) {
                    return;
                }
                this.validateForm(
                    response.body.numberDifference as number,
                    new ImageData(new Uint8ClampedArray(response.body.data), response.body.width, response.body.height, { colorSpace: 'srgb' }),
                );
            });
    }
    // set submit function but it will be done with the route
    async onSubmit() {
        this.isGameValid();
    }
}
