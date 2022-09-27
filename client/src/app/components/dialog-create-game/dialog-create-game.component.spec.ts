import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '@app/modules/material.module';

import { DialogCreateGameComponent } from './dialog-create-game.component';

describe('DialogCreateGameComponent', () => {
    let component: DialogCreateGameComponent;
    let fixture: ComponentFixture<DialogCreateGameComponent>;
    const model = { expansionRadius: 0, src: {} as ImageBitmap, difference: {} as ImageBitmap };
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DialogCreateGameComponent],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: model }],
            imports: [AppMaterialModule, BrowserAnimationsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogCreateGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
