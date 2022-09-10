import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationPageComponent } from './administration-page.component';

describe('AdminPageComponent', () => {
    let component: AdministrationPageComponent;
    let fixture: ComponentFixture<AdministrationPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdministrationPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AdministrationPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
