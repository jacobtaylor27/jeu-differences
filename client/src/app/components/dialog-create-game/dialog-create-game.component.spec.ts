import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Canvas } from '@app/enums/canvas';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationService } from '@app/services/communication/communication.service';
import { of } from 'rxjs';

import { DialogCreateGameComponent } from './dialog-create-game.component';

describe('DialogCreateGameComponent', () => {
    let component: DialogCreateGameComponent;
    let fixture: ComponentFixture<DialogCreateGameComponent>;
    let spyCommunicationService: jasmine.SpyObj<CommunicationService>;
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
        spyCommunicationService = jasmine.createSpyObj('CommunicationService', ['createGame']);
        await TestBed.configureTestingModule({
            declarations: [DialogCreateGameComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: model },
                { provide: CommunicationService, useValue: spyCommunicationService },
            ],
            imports: [AppMaterialModule, BrowserAnimationsModule, HttpClientModule, FormsModule, ReactiveFormsModule],
        }).compileComponents();
        fixture = TestBed.createComponent(DialogCreateGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should post the game', () => {
        spyCommunicationService.createGame.and.callFake(() => {
            return of();
        });
        component.createGame();
        expect(spyCommunicationService.createGame).toHaveBeenCalled();

        spyCommunicationService.createGame.and.callFake(() => {
            return of(null);
        });
        component.createGame();
        expect(spyCommunicationService.createGame).toHaveBeenCalled();
    });
});
