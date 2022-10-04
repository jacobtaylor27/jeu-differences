import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Canvas } from '@app/enums/canvas';
import { AppMaterialModule } from '@app/modules/material.module';

import { DialogCreateGameComponent } from './dialog-create-game.component';

describe('DialogCreateGameComponent', () => {
    let component: DialogCreateGameComponent;
    let fixture: ComponentFixture<DialogCreateGameComponent>;
    const image = new ImageData(Canvas.WIDTH, Canvas.HEIGHT);
    const pixelLength = 4;
    const model = {
        expansionRadius: 0,
        nbDifference: 0,
        differenceImage: new Array(pixelLength * Canvas.WIDTH * Canvas.HEIGHT).fill(0),
        src: image,
        difference: image,
    };
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DialogCreateGameComponent],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: model }],
            imports: [AppMaterialModule, BrowserAnimationsModule, HttpClientModule],
        }).compileComponents();
        fixture = TestBed.createComponent(DialogCreateGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should post the game', () => {
        component.createGame();
    });
});
