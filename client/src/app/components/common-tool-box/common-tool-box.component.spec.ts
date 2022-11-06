import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonToolBoxComponent } from './common-tool-box.component';

describe('CommonToolBoxComponent', () => {
    let component: CommonToolBoxComponent;
    let fixture: ComponentFixture<CommonToolBoxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CommonToolBoxComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CommonToolBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
