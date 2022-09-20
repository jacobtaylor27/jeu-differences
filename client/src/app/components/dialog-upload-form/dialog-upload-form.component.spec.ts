import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { Subject } from 'rxjs';

import { DialogUploadFormComponent } from './dialog-upload-form.component';

describe('DialogUploadFormComponent', () => {
    let component: DialogUploadFormComponent;
    let fixture: ComponentFixture<DialogUploadFormComponent>;
    let toolBoxServiceSpyObj: jasmine.SpyObj<ToolBoxService>;
    beforeEach(async () => {
        toolBoxServiceSpyObj = jasmine.createSpyObj(
            'ToolBoxService',
            [],
            [{ $uploadImageInDiff: new Subject(), $uploadImageInSource: new Subject() }],
        );
        await TestBed.configureTestingModule({
            declarations: [DialogUploadFormComponent],
            providers: [{ provide: ToolBoxService, useValue: toolBoxServiceSpyObj }],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogUploadFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create a image from a file stream', async () => {
        const expectedImage = {} as ImageBitmap;
        const createImageSpy = spyOn(window, 'createImageBitmap').and.resolveTo(expectedImage);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const image = await component.createImage({ slice: () => {} } as File);
        expect(createImageSpy).toHaveBeenCalled();
        expect(image).toEqual(expectedImage);
    });

    it('should return if the type is bmp', () => {
        const expectedTypeTrue = 'image/bmp';
        const expectedTypeFalse = 'image/png';
        expect(component.isImageTypeCorrect({ type: expectedTypeTrue } as File)).toBeTrue();
        expect(component.isImageTypeCorrect({ type: expectedTypeFalse } as File)).toBeFalse();
    });

    it('should check if the image is correct', async () => {
        const spySize = spyOn(component, 'isSizeCorrect').and.resolveTo(true);
        const spyType = spyOn(component, 'isImageTypeCorrect').and.returnValue(true);
        expect(await component.isImageCorrect({} as File)).toBeTrue();
        expect(spySize).toHaveBeenCalled();
        expect(spyType).toHaveBeenCalled();
        spySize.and.resolveTo(false);
        spyType.and.returnValue(true);
        expect(await component.isImageCorrect({} as File)).toBeFalse();
        spySize.and.resolveTo(true);
        spyType.and.returnValue(false);
        expect(await component.isImageCorrect({} as File)).toBeFalse();
        spySize.and.resolveTo(false);
        spyType.and.returnValue(false);
        expect(await component.isImageCorrect({} as File)).toBeFalse();
    });
    });
});
