import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModule } from '@app/modules/material.module';

import { BetweenImagesToolBoxComponent } from './between-images-tool-box.component';

describe('BetweenImagesToolBoxComponent', () => {
    let component: BetweenImagesToolBoxComponent;
    let fixture: ComponentFixture<BetweenImagesToolBoxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BetweenImagesToolBoxComponent],
            imports: [AppMaterialModule],
        }).compileComponents();

        fixture = TestBed.createComponent(BetweenImagesToolBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
