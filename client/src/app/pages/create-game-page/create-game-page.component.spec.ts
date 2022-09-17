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

    it('should sizeImgValidator return null if the value of control is null', () => {
        const mockControl = { value: null } as FormControl;
        const mockSize = { x: 0, y: 0 };
        expect(component.sizeImgValidator(mockSize.x, mockSize.y)(mockControl)).toEqual(null);
    });

    it('should sizeImgValidator return null if the size of the img is not the size of the canvas', () => {
        const mockControl = { value: { height: 1, width: 1 } } as FormControl;
        const mockSize = { x: 0, y: 0 };
        expect(component.sizeImgValidator(mockSize.x, mockSize.y)(mockControl)).toEqual(null);
    });

    it('should sizeImgValidator return not null if the size of the image is the size of the canvas', () => {
        const mockControl = { value: { height: 1, width: 1 } } as FormControl;
        const mockSize = { x: 1, y: 1 };
        const validator = component.sizeImgValidator(mockSize.x, mockSize.y)(mockControl);
        expect(validator).not.toEqual(null);
        expect(validator?.sizeImg.value).toEqual(mockControl.value);
    });

    it('should differenceValidator return null if the number of difference is not < 10 and > 2 ', () => {
        const calcDiffSpy = spyOn(component, 'calculateDifference').and.callFake(() => 0);
        const mockControl = { value: 'test' } as FormControl;
        const nbDifference = component.differenceValidator()(mockControl);
        expect(calcDiffSpy).toHaveBeenCalled();
        expect(nbDifference).toEqual(null);
    });

    it('should differenceValidator return the value control of if the number of difference is < 10 and > 2', () => {
        const mockDiff = 5;
        const calcDiffSpy = spyOn(component, 'calculateDifference').and.callFake(() => mockDiff);
        const mockControl = { value: 'test' } as FormControl;
        const nbDifference = component.differenceValidator()(mockControl);
        expect(calcDiffSpy).toHaveBeenCalled();
        expect(nbDifference).not.toEqual(null);
        expect(nbDifference?.difference.value).toEqual(mockControl.value);
    });

});
