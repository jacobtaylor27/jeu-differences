import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogCreateGameComponent } from '@app/components/dialog-create-game/dialog-create-game.component';
import { DialogFormsErrorComponent } from '@app/components/dialog-forms-error/dialog-forms-error.component';
import { DrawCanvasComponent } from '@app/components/draw-canvas/draw-canvas.component';
import { ExitGameButtonComponent } from '@app/components/exit-game-button/exit-game-button.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { ToolBoxComponent } from '@app/components/tool-box/tool-box.component';
import { CanvasType } from '@app/enums/canvas-type';
import { Pencil } from '@app/interfaces/pencil';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationService } from '@app/services/communication/communication.service';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { of, Subject } from 'rxjs';
import { CreateGamePageComponent } from './create-game-page.component';

describe('CreateGamePageComponent', () => {
    let component: CreateGamePageComponent;
    let fixture: ComponentFixture<CreateGamePageComponent>;
    let dialogSpyObj: jasmine.SpyObj<MatDialog>;
    let communicationSpyObject: jasmine.SpyObj<CommunicationService>;
    let toolBoxServiceSpyObj: jasmine.SpyObj<ToolBoxService>;
    let drawServiceSpyObj: jasmine.SpyObj<DrawService>;

    beforeEach(async () => {
        dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
        communicationSpyObject = jasmine.createSpyObj('CommunicationService', ['validateGame']);
        toolBoxServiceSpyObj = jasmine.createSpyObj('ToolBoxService', ['addCanvasType'], {
            $pencil: new Map<CanvasType, Subject<Pencil>>(),
            $uploadImage: new Map<CanvasType, Subject<ImageBitmap>>(),
            $resetBackground: new Map<CanvasType, Subject<void>>(),
            $switchForeground: new Map<CanvasType, Subject<void>>(),
            $resetForeground: new Map<CanvasType, Subject<void>>(),
        });
        drawServiceSpyObj = jasmine.createSpyObj('DrawService', ['addDrawingCanvas'], { $drawingImage: new Map(), foregroundContext: new Map() });
        await TestBed.configureTestingModule({
            declarations: [
                CreateGamePageComponent,
                DrawCanvasComponent,
                ToolBoxComponent,
                DialogCreateGameComponent,
                PageHeaderComponent,
                ExitGameButtonComponent,
            ],
            imports: [HttpClientTestingModule, AppMaterialModule, BrowserAnimationsModule, ReactiveFormsModule],
            providers: [
                { provide: MatDialog, useValue: dialogSpyObj },
                { provide: CommunicationService, useValue: communicationSpyObject },
                { provide: ToolBoxService, useValue: toolBoxServiceSpyObj },
                { provide: DrawService, useValue: drawServiceSpyObj },
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

    it('should open a dialog to validate the game settings', async () => {
        component.validateForm(0, [0]);
        expect(dialogSpyObj.open).toHaveBeenCalled();
    });

    it('should open the validate dialog if the form is valid', async () => {
        spyOnProperty(component.form, 'valid').and.returnValue(true);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const validateFormSpy = spyOn(component, 'validateForm').and.callFake(() => {});
        communicationSpyObject.validateGame.and.callFake(() => {
            return of({ body: { numberDifference: 0, data: [0], height: 1, width: 1 } } as HttpResponse<{
                numberDifference: number;
                width: number;
                height: number;
                data: number[];
            }>);
        });
        component.isGameValid();
        expect(validateFormSpy).toHaveBeenCalled();
    });

    it('should not open the validate dialog if the form is not valid and body is null', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const validateFormSpy = spyOn(component, 'validateForm').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const manageErrorFormFormSpy = spyOn(component, 'manageErrorInForm').and.callFake(() => {});
        communicationSpyObject.validateGame.and.callFake(() => {
            return of({ body: null } as HttpResponse<{
                numberDifference: number;
                width: number;
                height: number;
                data: number[];
            }>);
        });
        component.isGameValid();
        expect(validateFormSpy).not.toHaveBeenCalled();
        expect(manageErrorFormFormSpy).toHaveBeenCalled();
    });

    it('should not open the validate dialog if the form is not valid and response is null', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const validateFormSpy = spyOn(component, 'validateForm').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const manageErrorFormFormSpy = spyOn(component, 'manageErrorInForm').and.callFake(() => {});
        communicationSpyObject.validateGame.and.callFake(() => of(null));
        component.isGameValid();
        expect(validateFormSpy).not.toHaveBeenCalled();
        expect(manageErrorFormFormSpy).toHaveBeenCalled();
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

    // it('should add new image ', () => {
    //     const spySetDrawingImage = spyOn(component.drawingImage as Map<CanvasType, ImageData>, 'set');
    //     drawServiceSpyObj.$drawingImage.get(CanvasType.Left)?.next({} as ImageData);
    //     expect(spySetDrawingImage).toHaveBeenCalled();
    // });
});
