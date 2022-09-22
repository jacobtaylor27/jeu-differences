import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '@app/modules/material.module';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { Subject } from 'rxjs';

import { DialogUploadFormComponent } from './dialog-upload-form.component';

describe('DialogUploadFormComponent', () => {
    let component: DialogUploadFormComponent;
    let fixture: ComponentFixture<DialogUploadFormComponent>;
    let toolBoxServiceSpyObj: jasmine.SpyObj<ToolBoxService>;
    beforeEach(async () => {
        toolBoxServiceSpyObj = jasmine.createSpyObj('ToolBoxService', [], { $uploadImageInDiff: new Subject(), $uploadImageInSource: new Subject() });
        await TestBed.configureTestingModule({
            declarations: [DialogUploadFormComponent],
            providers: [{ provide: ToolBoxService, useValue: toolBoxServiceSpyObj }],
            imports: [AppMaterialModule, BrowserAnimationsModule, ReactiveFormsModule],
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

    it('should check the size of the image', async () => {
        const expectedSize = { height: 480, width: 640 };
        const spyCreateImage = spyOn(component, 'createImage').and.resolveTo(expectedSize as ImageBitmap);
        expect(await component.isSizeCorrect({} as File)).toBeTrue();
        let notExpectedSize = { height: 400, width: 640 };
        spyCreateImage.and.resolveTo(notExpectedSize as ImageBitmap);
        expect(await component.isSizeCorrect({} as File)).toBeFalse();
        notExpectedSize = { height: 400, width: 600 };
        spyCreateImage.and.resolveTo(notExpectedSize as ImageBitmap);
        expect(await component.isSizeCorrect({} as File)).toBeFalse();
        notExpectedSize = { height: 480, width: 600 };
        spyCreateImage.and.resolveTo(notExpectedSize as ImageBitmap);
        expect(await component.isSizeCorrect({} as File)).toBeFalse();
    });

    it('should manage event to upload an image', async () => {
        const spyImage = spyOn(component, 'isImageCorrect').and.callFake(async () => new Promise((resolve) => resolve(true)));
        const expectedImage = {} as ImageBitmap;
        const spyCreateImage = spyOn(component, 'createImage').and.callFake(async () => new Promise((resolve) => resolve(expectedImage)));
        await component.uploadImage({
            target: {
                files: {
                    item: () => {
                        return {} as File;
                    },
                    length: 1,
                } as FileList,
            } as HTMLInputElement,
        } as unknown as Event);
        expect(spyImage).toHaveBeenCalled();
        expect(spyCreateImage).toHaveBeenCalled();
    });

    it('should manage event to not upload an image if the image doesn t have the good requirement', async () => {
        const spyImage = spyOn(component, 'isImageCorrect').and.callFake(async () => new Promise((resolve) => resolve(false)));
        const expectedImage = {} as ImageBitmap;
        const spyCreateImage = spyOn(component, 'createImage').and.callFake(async () => new Promise((resolve) => resolve(expectedImage)));
        await component.uploadImage({
            target: {
                files: {
                    item: () => {
                        return {} as File;
                    },
                    length: 1,
                } as FileList,
            } as HTMLInputElement,
        } as unknown as Event);
        expect(spyImage).toHaveBeenCalled();
        expect(spyCreateImage).not.toHaveBeenCalled();
    });

    it('should not submit a form because the type is not good', async () => {
        const expectedType = '';
        spyOn(component.form, 'get').and.returnValue(new FormControl(expectedType));
        const spyDiff = spyOn(toolBoxServiceSpyObj.$uploadImageInDiff, 'next');
        const spySource = spyOn(toolBoxServiceSpyObj.$uploadImageInSource, 'next');
        toolBoxServiceSpyObj.$uploadImageInDiff.subscribe((newImage: ImageBitmap) => {
            expect(newImage).toEqual(component.img);
        });
        toolBoxServiceSpyObj.$uploadImageInSource.subscribe((newImage: ImageBitmap) => {
            expect(newImage).toEqual(component.img);
        });
        component.onSubmit();
        expect(spyDiff).not.toHaveBeenCalled();
        expect(spySource).not.toHaveBeenCalled();
    });

    it('should submit a form because the type is both', async () => {
        const expectedType = 'both';
        spyOn(component.form, 'get').and.returnValue(new FormControl(expectedType));
        const spyDiff = spyOn(toolBoxServiceSpyObj.$uploadImageInDiff, 'next');
        const spySource = spyOn(toolBoxServiceSpyObj.$uploadImageInSource, 'next');
        toolBoxServiceSpyObj.$uploadImageInDiff.subscribe((newImage: ImageBitmap) => {
            expect(newImage).toEqual(component.img);
        });
        toolBoxServiceSpyObj.$uploadImageInSource.subscribe((newImage: ImageBitmap) => {
            expect(newImage).toEqual(component.img);
        });
        component.onSubmit();
        expect(spyDiff).toHaveBeenCalled();
        expect(spySource).toHaveBeenCalled();
    });

    it('should submit a form because the type is difference', async () => {
        const expectedType = 'difference';
        spyOn(component.form, 'get').and.returnValue(new FormControl(expectedType));
        const spyDiff = spyOn(toolBoxServiceSpyObj.$uploadImageInDiff, 'next');
        const spySource = spyOn(toolBoxServiceSpyObj.$uploadImageInSource, 'next');
        toolBoxServiceSpyObj.$uploadImageInDiff.subscribe((newImage: ImageBitmap) => {
            expect(newImage).toEqual(component.img);
        });
        toolBoxServiceSpyObj.$uploadImageInSource.subscribe((newImage: ImageBitmap) => {
            expect(newImage).toEqual(component.img);
        });
        component.onSubmit();
        expect(spyDiff).toHaveBeenCalled();
        expect(spySource).not.toHaveBeenCalled();
    });

    it('should submit a form because the type is source', async () => {
        const expectedType = 'source';
        spyOn(component.form, 'get').and.returnValue(new FormControl(expectedType));
        const spyDiff = spyOn(toolBoxServiceSpyObj.$uploadImageInDiff, 'next');
        const spySource = spyOn(toolBoxServiceSpyObj.$uploadImageInSource, 'next');
        toolBoxServiceSpyObj.$uploadImageInDiff.subscribe((newImage: ImageBitmap) => {
            expect(newImage).toEqual(component.img);
        });
        toolBoxServiceSpyObj.$uploadImageInSource.subscribe((newImage: ImageBitmap) => {
            expect(newImage).toEqual(component.img);
        });
        component.onSubmit();
        expect(spyDiff).not.toHaveBeenCalled();
        expect(spySource).toHaveBeenCalled();
    });
});
