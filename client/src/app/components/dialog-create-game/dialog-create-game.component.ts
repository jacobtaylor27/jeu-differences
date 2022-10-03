// import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Theme } from '@app/enums/theme';

@Component({
    selector: 'app-dialog-create-game',
    templateUrl: './dialog-create-game.component.html',
    styleUrls: ['./dialog-create-game.component.scss'],
})
export class DialogCreateGameComponent implements AfterViewInit {
    @ViewChild('imageDifference', { static: false }) differentImage!: ElementRef<HTMLCanvasElement>;
    theme: typeof Theme = Theme;
    name: FormControl = new FormControl('', Validators.pattern(''));
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: {
            expansionRadius: number;
            src: ImageData;
            difference: ImageData;
            nbDifference: number;
            differenceImage: ImageData;
        } /* private http: HttpClient */,
    ) {}

    ngAfterViewInit() {
        const ctx = this.differentImage.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        ctx.putImageData(this.data.differenceImage, 0, 0);
    }
    createGame() {
        return;
    }
}
