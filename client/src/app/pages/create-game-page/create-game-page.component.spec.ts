import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogFormsErrorComponent } from '@app/components/dialog-forms-error/dialog-forms-error.component';
import { DrawCanvasComponent } from '@app/components/draw-canvas/draw-canvas.component';
import { ToolBoxComponent } from '@app/components/tool-box/tool-box.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationService } from '@app/services/communication/communication.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { of, Subject } from 'rxjs';

import { CreateGamePageComponent } from './create-game-page.component';

describe('CreateGamePageComponent', () => {
    let component: CreateGamePageComponent;
    let fixture: ComponentFixture<CreateGamePageComponent>;
    let dialogSpyObj: jasmine.SpyObj<MatDialog>;
    let communicationSpyObject: jasmine.SpyObj<CommunicationService>;
    let toolBoxServiceSpyObj: jasmine.SpyObj<ToolBoxService>;

    beforeEach(async () => {
        dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
        communicationSpyObject = jasmine.createSpyObj('CommunicationService', ['validateGame']);
        toolBoxServiceSpyObj = jasmine.createSpyObj('ToolBoxService', [], {
            $uploadImageInSource: new Subject(),
            $resetSource: new Subject(),
            $pencil: new Subject(),
            $uploadImageInDiff: new Subject(),
            $resetDiff: new Subject(),
        });
        await TestBed.configureTestingModule({
            declarations: [CreateGamePageComponent, DrawCanvasComponent, ToolBoxComponent],
            imports: [HttpClientTestingModule, AppMaterialModule, BrowserAnimationsModule, ReactiveFormsModule],
            providers: [
                { provide: MatDialog, useValue: dialogSpyObj },
                { provide: CommunicationService, useValue: communicationSpyObject },
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
        const expectedErrorMessages = 'test is not valid';
        component.manageErrorInForm(expectedErrorMessages);
        expect(dialogSpyObj.open).toHaveBeenCalledWith(DialogFormsErrorComponent, {
            data: { formTitle: 'Create Game Form', errorMessages: [expectedErrorMessages] },
        });
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

    it('should create the source image from the canvas', async () => {
        const expectedBmpImage = new ImageData(1, 1);
        const ctx = component.sourceImg.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const spyCreateBmpImage = spyOn(ctx, 'getImageData').and.returnValue(expectedBmpImage);
        expect(component.createSourceImageFromCanvas()).toEqual(expectedBmpImage);
        expect(spyCreateBmpImage).toHaveBeenCalled();
    });

    it('should open a dialog to validate the game settings', async () => {
        component.validateForm(0, [0]);
        expect(dialogSpyObj.open).toHaveBeenCalled();
    });

    it('should open the validate dialog if the form is valid', async () => {
        spyOnProperty(component.form, 'valid').and.returnValue(true);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        spyOn(component, 'validateForm').and.callFake(() => {});
        communicationSpyObject.validateGame.and.callFake(() => {
            return of({ body: { numberDifference: 0, data: [0], height: 1, width: 1 } } as HttpResponse<{
                numberDifference: number;
                width: number;
                height: number;
                data: number[];
            }>);
        });
        component.isGameValid();
        // expect(spyValidateFormDialog).toHaveBeenCalled();
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

    it('should clear an image', () => {
        const ctx = component.sourceImg.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const createRectangleSpy = spyOn(ctx, 'rect');
        const fillRectSpy = spyOn(ctx, 'fill');
        toolBoxServiceSpyObj.$resetSource.subscribe(() => {
            expect(createRectangleSpy).toHaveBeenCalled();
            expect(fillRectSpy).toHaveBeenCalled();
        });
        component.ngAfterViewInit();
        toolBoxServiceSpyObj.$resetSource.next();
    });

    it('should do not validate the form if the response is undefined', () => {
        const validateFormSpy = spyOn(component, 'validateForm');
        communicationSpyObject.validateGame.and.returnValue(
            of({} as HttpResponse<{ numberDifference: number; width: number; height: number; data: number[] }>),
        );
        component.isGameValid();
        expect(validateFormSpy).not.toHaveBeenCalled();
    });

    it('should do not validate the form if the response is undefined', () => {
        const validateFormSpy = spyOn(component, 'validateForm');
        communicationSpyObject.validateGame.and.returnValue(
            of({} as HttpResponse<{ numberDifference: number; width: number; height: number; data: number[] }>),
        );
        component.isGameValid();
        expect(validateFormSpy).not.toHaveBeenCalled();
    });
});
