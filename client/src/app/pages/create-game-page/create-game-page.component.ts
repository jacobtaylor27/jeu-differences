import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateGameComponent } from '@app/components/dialog-create-game/dialog-create-game.component';
import { DialogFormsErrorComponent } from '@app/components/dialog-forms-error/dialog-forms-error.component';
import { LoadingScreenComponent } from '@app/components/loading-screen/loading-screen.component';
import { Canvas } from '@app/enums/canvas';
import { CanvasType } from '@app/enums/canvas-type';
import { Theme } from '@app/enums/theme';
import { CanvasEventHandlerService } from '@app/services/canvas-event-handler/canvas-event-handler.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { ExitButtonHandlerService } from '@app/services/exit-button-handler/exit-button-handler.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-create-game-page',
    templateUrl: './create-game-page.component.html',
    styleUrls: ['./create-game-page.component.scss'],
})
export class CreateGamePageComponent implements AfterViewInit {
    form: FormGroup;
    theme: typeof Theme = Theme;
    drawingImage: Map<CanvasType, ImageData> = new Map();
    canvasType: typeof CanvasType = CanvasType;
    // eslint-disable-next-line max-params
    constructor(
        private toolBoxService: ToolBoxService,
        public dialog: MatDialog,
        private drawService: DrawService,
        private communication: CommunicationService,
        private canvasEventHandler: CanvasEventHandlerService,
        exitButtonService: ExitButtonHandlerService,
    ) {
        this.drawingImage.set(CanvasType.Left, new ImageData(Canvas.WIDTH, Canvas.HEIGHT));
        this.drawingImage.set(CanvasType.Right, new ImageData(Canvas.WIDTH, Canvas.HEIGHT));

        exitButtonService.setCreateGamePage();
        this.form = new FormGroup({
            expansionRadius: new FormControl(3, Validators.required),
        });
    }

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (!event.ctrlKey) {
            return;
        }
        if (event.key !== 'z' && event.key !== 'Z') {
            return;
        }
        if (event.shiftKey) {
            this.canvasEventHandler.handleCtrlShiftZ();
        } else {
            this.canvasEventHandler.handleCtrlZ();
        }
    }

    ngAfterViewInit(): void {
        this.drawService.$drawingImage.forEach((event: Subject<ImageData>, canvasType: CanvasType) => {
            event.subscribe((newImage: ImageData) => {
                this.drawingImage.set(canvasType, newImage);
            });
        });

        this.toolBoxService.$resetBackground.forEach((event: Subject<void>) => {
            event.next();
        });
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
                src: this.drawingImage.get(CanvasType.Right),
                difference: this.drawingImage.get(CanvasType.Left),
                nbDifference,
                differenceImage,
            },
        });
    }

    isGameValid() {
        this.dialog.open(LoadingScreenComponent, { panelClass: 'custom-dialog-container' });
        return this.communication
            .validateGame(
                this.drawingImage.get(CanvasType.Right) as ImageData,
                this.drawingImage.get(CanvasType.Left) as ImageData,
                parseInt((this.form.get('expansionRadius') as FormControl).value, 10),
            )
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
