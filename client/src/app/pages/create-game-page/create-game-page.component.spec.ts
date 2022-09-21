import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogFormsErrorComponent } from '@app/components/dialog-forms-error/dialog-forms-error.component';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { Subject } from 'rxjs';

import { CreateGamePageComponent } from './create-game-page.component';

describe('CreateGamePageComponent', () => {
    let component: CreateGamePageComponent;
    let fixture: ComponentFixture<CreateGamePageComponent>;
    let dialogSpyObj: jasmine.SpyObj<MatDialog>;
    let httpSpyObj: jasmine.SpyObj<HttpClient>;
    let toolBoxServiceSpyObj: jasmine.SpyObj<ToolBoxService>;

    beforeEach(async () => {
        dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
        httpSpyObj = jasmine.createSpyObj('HttpClient', ['post']);
        toolBoxServiceSpyObj = jasmine.createSpyObj('ToolBoxService', [], { $uploadImageInSource: new Subject() });
        await TestBed.configureTestingModule({
            declarations: [CreateGamePageComponent],
            imports: [HttpClientModule, MatDialogModule],
            providers: [
                { provide: MatDialog, useValue: dialogSpyObj },
                { provide: HttpClient, useValue: httpSpyObj },
                { provide: ToolBoxService, useValue: toolBoxServiceSpyObj },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CreateGamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not submit the form and open dialog if it s invalid', () => {
        component.form = {
            valid: false,
            controls: { test: { valid: false } as FormControl, test1: { valid: true } as FormControl },
        } as unknown as FormGroup;
        const expectedErrorMessages = ['test is not valid'];
        component.onSubmit();
        expect(dialogSpyObj.open).toHaveBeenCalledWith(DialogFormsErrorComponent, {
            data: { formTitle: 'Create Game Form', errorMessages: expectedErrorMessages },
        });
    });

    it('should post the game settings when the form is valid', () => {
        const formSpyObj = jasmine.createSpyObj('FormGroup', ['get', 'valid']);
        formSpyObj.get.and.callFake(() => new FormControl());
        const nbTimesFormGetCall = 4;
        component.form = formSpyObj;
        component.onSubmit();
        expect(httpSpyObj.post).toHaveBeenCalled();
        expect(formSpyObj.get).toHaveBeenCalledTimes(nbTimesFormGetCall);
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

    it('should calculateDifference return the number of difference between two images', () => {
        const expectedDifference = 5;
        expect(component.calculateDifference()).toEqual(expectedDifference);
    });
    it('should subscribe to get the new image and draw it', async () => {
        const ctx = component.sourceImg.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const spyDrawImage = spyOn(ctx, 'drawImage');
        toolBoxServiceSpyObj.$uploadImageInSource.subscribe(() => {
            expect(spyDrawImage).toHaveBeenCalled();
        });
        component.ngAfterViewInit();
        toolBoxServiceSpyObj.$uploadImageInSource.next({} as ImageBitmap);
    });

    it('should subscribe to get the new image and draw it', async () => {
        const ctx = component.sourceImg.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        spyOn(component.sourceImg.nativeElement, 'getContext').and.callFake(() => null);
        const spyDrawImage = spyOn(ctx, 'drawImage');
        toolBoxServiceSpyObj.$uploadImageInSource.subscribe(() => {
            expect(spyDrawImage).not.toHaveBeenCalled();
        });
        component.ngAfterViewInit();
        toolBoxServiceSpyObj.$uploadImageInSource.next({} as ImageBitmap);
    });
});
