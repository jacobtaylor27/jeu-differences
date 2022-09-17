import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogFormsErrorComponent } from '@app/components/dialog-forms-error/dialog-forms-error.component';

import { CreateGamePageComponent } from './create-game-page.component';

describe('CreateGamePageComponent', () => {
    let component: CreateGamePageComponent;
    let fixture: ComponentFixture<CreateGamePageComponent>;
    let dialogSpyObj: jasmine.SpyObj<MatDialog>;
    let httpSpyObj: jasmine.SpyObj<HttpClient>;

    beforeEach(async () => {
        dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
        httpSpyObj = jasmine.createSpyObj('HttpClient', ['post']);
        await TestBed.configureTestingModule({
            declarations: [CreateGamePageComponent],
            imports: [HttpClientModule, MatDialogModule],
            providers: [
                { provide: MatDialog, useValue: dialogSpyObj },
                { provide: HttpClient, useValue: httpSpyObj },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CreateGamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
