import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateGameComponent } from '@app/components/dialog-create-game/dialog-create-game.component';
import { DialogFormsErrorComponent } from '@app/components/dialog-forms-error/dialog-forms-error.component';
import { Canvas } from '@app/enums/canvas';
import { PropagateCanvasEvent } from '@app/enums/propagate-canvas-event';
import { Theme } from '@app/enums/theme';
import { CommunicationService } from '@app/services/communication/communication.service';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

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
    canvasPosition: typeof PropagateCanvasEvent = PropagateCanvasEvent;
    // eslint-disable-next-line max-params
    constructor(
        private toolBoxService: ToolBoxService,
        public dialog: MatDialog,
        private drawService: DrawService,
        private communication: CommunicationService,
    ) {
        this.form = new FormGroup({
            expansionRadius: new FormControl(3, Validators.required),
        });
    }

    ngAfterViewInit(): void {
        this.toolBoxService.$uploadImageInSource.subscribe((newImage: ImageBitmap) =>
            (this.sourceImg.nativeElement.getContext('2d') as CanvasRenderingContext2D).drawImage(newImage, 0, 0),
        );

        this.toolBoxService.$resetSource.subscribe(() => this.resetCanvas(this.sourceImg.nativeElement.getContext('2d') as CanvasRenderingContext2D));
        this.drawService.$differenceImage.subscribe((newImageDifference: ImageData) => {
            this.imageDifference = newImageDifference;
        });
        this.toolBoxService.$resetDiff.next();
        this.resetCanvas(this.sourceImg.nativeElement.getContext('2d') as CanvasRenderingContext2D);
    }

    resetCanvas(ctx: CanvasRenderingContext2D) {
        ctx.rect(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    createSourceImageFromCanvas(): ImageData {
        return (this.sourceImg.nativeElement.getContext('2d') as CanvasRenderingContext2D).getImageData(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
    }

    manageErrorInForm(validationImageErrors: string) {
        this.dialog.open(DialogFormsErrorComponent, {
            data: { formTitle: 'Create Game Form', errorMessages: [validationImageErrors] },
        });
    }

    validateForm(nbDifference: number, differenceImage: number[]) {
        this.dialog.open(DialogCreateGameComponent, {
            data: {
                expansionRadius: parseInt((this.form.get('expansionRadius') as FormControl).value, 10),
                src: this.createSourceImageFromCanvas(),
                difference: this.imageDifference,
                nbDifference,
                differenceImage,
            },
        });
    }

    isGameValid() {
        const original: ImageData = this.createSourceImageFromCanvas();
        return this.communication
            .validateGame(original, this.imageDifference, parseInt((this.form.get('expansionRadius') as FormControl).value, 10))
            .subscribe((response: HttpResponse<{ numberDifference: number; width: number; height: number; data: number[] }> | null) => {
                if (!response || !response.body) {
                    this.manageErrorInForm('Il faut entre 3 et 9 differences');
                    return;
                }
                this.validateForm(response.body.numberDifference as number, response.body.data);
            });
    }
}
