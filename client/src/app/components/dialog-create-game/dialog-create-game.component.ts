// import { HttpClient } from '@angular/common/http';
import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Theme } from '@app/enums/theme';

@Component({
    selector: 'app-dialog-create-game',
    templateUrl: './dialog-create-game.component.html',
    styleUrls: ['./dialog-create-game.component.scss'],
})
export class DialogCreateGameComponent {
    @ViewChild('imageDifference', { static: false }) image!: HTMLCanvasElement;
    nbDifference: number;
    theme: typeof Theme = Theme;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { expansionRadius: number; src: ImageBitmap; difference: ImageBitmap }, // private http: HttpClient,
    ) {
        console.log(data.src);
        console.log(data.difference);
        //     this.http.post('', {}).subscribe((res: object) => {
        //         console.log(res);
        //     }); // get the image of difference
        //     this.http.post('', {}).subscribe((res: object) => {
        //         console.log(res);
        //     }); // get the number of difference
        // }
    }

    createGame() {
        return;
    }
}
