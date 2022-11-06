import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateGameComponent } from '@app/components/dialog-create-game/dialog-create-game.component';
import { DialogFormsErrorComponent } from '@app/components/dialog-forms-error/dialog-forms-error.component';
import { LoadingScreenComponent } from '@app/components/loading-screen/loading-screen.component';
import { Canvas } from '@app/enums/canvas';
import { PropagateCanvasEvent } from '@app/enums/propagate-canvas-event';
import { Theme } from '@app/enums/theme';
import { CommunicationService } from '@app/services/communication/communication.service';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { ExitButtonHandlerService } from '@app/services/exit-button-handler/exit-button-handler.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

@Component({
    selector: 'app-create-game-page',
    templateUrl: './create-game-page.component.html',
    styleUrls: ['./create-game-page.component.scss'],
})
export class CreateGamePageComponent implements AfterViewInit {
    form: FormGroup;
    theme: typeof Theme = Theme;
    leftDifferenceImage: ImageData = new ImageData(Canvas.WIDTH, Canvas.HEIGHT);
    rightDifferenceImage: ImageData = new ImageData(Canvas.WIDTH, Canvas.HEIGHT);
    canvasPosition: typeof PropagateCanvasEvent = PropagateCanvasEvent;
    // eslint-disable-next-line max-params
    constructor(
        private toolBoxService: ToolBoxService,
        public dialog: MatDialog,
        private drawService: DrawService,
        private communication: CommunicationService,
        exitButtonService: ExitButtonHandlerService,
    ) {
        exitButtonService.setCreateGamePage();
        this.form = new FormGroup({
            expansionRadius: new FormControl(3, Validators.required),
        });
    }

    ngAfterViewInit(): void {
        this.drawService.$differenceImage.subscribe((newImageDifference: ImageData) => {
            this.leftDifferenceImage = newImageDifference;
        });
        this.drawService.$sourceImage.subscribe((newImageDifference: ImageData) => {
            this.rightDifferenceImage = newImageDifference;
        });
        this.toolBoxService.$resetDiff.next();
        this.toolBoxService.$resetSource.next();
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
                src: this.rightDifferenceImage,
                difference: this.leftDifferenceImage,
                nbDifference,
                differenceImage,
            },
        });
    }

    isGameValid() {
        this.dialog.open(LoadingScreenComponent, { panelClass: 'custom-dialog-container' });
        return this.communication
            .validateGame(this.rightDifferenceImage, this.leftDifferenceImage, parseInt((this.form.get('expansionRadius') as FormControl).value, 10))
            .subscribe((response: HttpResponse<{ numberDifference: number; width: number; height: number; data: number[] }> | null) => {
                this.dialog.closeAll();
                if (!response || !response.body) {
                    this.manageErrorInForm('Il faut entre 3 et 9 differences');
                    return;
                }
                this.validateForm(response.body.numberDifference as number, response.body.data);
            });
    }
}
