import { ComponentFixture, TestBed } from '@angular/core/testing';

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

});
