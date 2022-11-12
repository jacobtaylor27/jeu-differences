import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshSnackbarComponent } from './refresh-snackbar.component';

describe('RefreshSnackbarComponent', () => {
    let component: RefreshSnackbarComponent;
    let fixture: ComponentFixture<RefreshSnackbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RefreshSnackbarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(RefreshSnackbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
