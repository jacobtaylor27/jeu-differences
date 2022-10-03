// import { HttpClient } from '@angular/common/http';
import { HttpClient, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CREATE_GAME } from '@app/constants/server';
import { Canvas } from '@app/enums/canvas';
import { Theme } from '@app/enums/theme';
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
        private http: HttpClient,
    ) {}

    ngAfterViewInit() {
        const ctx = this.differentImage.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        ctx.putImageData(new ImageData(new Uint8ClampedArray(this.data.differenceImage), Canvas.WIDTH, Canvas.HEIGHT, { colorSpace: 'srgb' }), 0, 0);
    }
    createGame() {
        this.http
            .post<Record<string, never>>(
                CREATE_GAME,
                {
                    original: { width: this.data.src.width, height: this.data.src.height, data: Array.from(this.data.src.data) },
                    modify: { width: this.data.difference.width, height: this.data.difference.height, data: Array.from(this.data.difference.data) },
                    differenceRadius: this.data.expansionRadius,
                    name: (this.form.get('name') as FormControl).value,
                },
                { observe: 'response' },
            )
            .pipe(
                catchError(() => {
                    console.log('Le serveur a eu un probleme pour sauvegarder le jeu');
                    return of(null);
                }),
            )
            .subscribe((response: HttpResponse<Record<string, never>> | null) => {
                if (!response) {
                    return;
                }
                switch (response.status) {
                    case HttpStatusCode.Created:
                        console.log('Le jeu est cree');
                        break;
                    default:
                        console.log('Le jeu n a pas ete accepter');
                        break;
                }
            });
    }
}
