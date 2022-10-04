// import { HttpClient } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Canvas } from '@app/enums/canvas';
import { Theme } from '@app/enums/theme';
import { CommunicationService } from '@app/services/communication/communication.service';
import { catchError, of } from 'rxjs';

@Component({
    selector: 'app-dialog-create-game',
    templateUrl: './dialog-create-game.component.html',
    styleUrls: ['./dialog-create-game.component.scss'],
})
export class DialogCreateGameComponent implements AfterViewInit {
    @ViewChild('imageDifference', { static: false }) differentImage!: ElementRef<HTMLCanvasElement>;
    theme: typeof Theme = Theme;
    form: FormGroup = new FormGroup({ name: new FormControl('', [Validators.pattern('[a-zA-Z ]*'), Validators.required]) });
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: {
            expansionRadius: number;
            src: ImageData;
            difference: ImageData;
            nbDifference: number;
            differenceImage: number[];
        },
        private communication: CommunicationService,
    ) {}

    ngAfterViewInit() {
        const ctx = this.differentImage.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        ctx.putImageData(new ImageData(new Uint8ClampedArray(this.data.differenceImage), Canvas.WIDTH, Canvas.HEIGHT, { colorSpace: 'srgb' }), 0, 0);
    }

    createGame() {
        this.communication
            .createGame(
                { original: this.data.src, modify: this.data.difference },
                this.data.expansionRadius,
                (this.form.get('name') as FormControl).value,
            )
            .pipe(
                catchError(() => {
                    return of(null);
                }),
            )
            .subscribe((response: HttpResponse<Record<string, never>> | null) => {
                if (!response) {
                    return;
                }
            });
    }
}
