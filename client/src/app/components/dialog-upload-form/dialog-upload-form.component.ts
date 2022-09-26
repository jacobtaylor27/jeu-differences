import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BMP_HEADER_OFFSET, FORMAT_IMAGE, IMAGE_TYPE, SIZE } from '@app/constants/canvas';
import { PropagateCanvasEvent } from '@app/enums/propagate-canvas-event';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

@Component({
    selector: 'app-dialog-upload-form',
    templateUrl: './dialog-upload-form.component.html',
    styleUrls: ['./dialog-upload-form.component.scss'],
})
export class DialogUploadFormComponent {
    form: FormGroup;
    isSizeImageCorrect: boolean = true;
    isTypeImageCorrect: boolean = true;
    isFormatBmpCorrect: boolean = true;
    img: ImageBitmap;
    isFormSubmitted: boolean = false;
    typePropagateCanvasEvent: typeof PropagateCanvasEvent = PropagateCanvasEvent;

    constructor(private toolService: ToolBoxService) {
        this.form = new FormGroup({
            type: new FormControl('', Validators.required),
            uploadImage: new FormControl(null, Validators.required),
        });
    }

    async uploadImage(event: Event) {
        const files: FileList = (event.target as HTMLInputElement).files as FileList;
        this.isFormSubmitted = await this.isImageCorrect(files[0]);
        if (files === null || !this.isFormSubmitted) {
            return;
        }

        this.img = await this.createImage(files[0]);
    }

    isImageFormatCorrect(bmpFormat: number) {
        this.isFormatBmpCorrect = bmpFormat === FORMAT_IMAGE;
        return this.isFormatBmpCorrect;
    }
    async isImageCorrect(file: File): Promise<boolean> {
        const bmpHeader = new DataView(await file.arrayBuffer());
        return (
            (await this.isSizeCorrect(file)) &&
            this.isImageTypeCorrect(file) &&
            this.isImageFormatCorrect(bmpHeader.getUint16(BMP_HEADER_OFFSET, true))
        );
    }

    async createImage(file: File): Promise<ImageBitmap> {
        return await createImageBitmap(file.slice());
    }

    isImageTypeCorrect(file: File): boolean {
        this.isTypeImageCorrect = file.type === IMAGE_TYPE;
        return this.isTypeImageCorrect;
    }

    async isSizeCorrect(file: File): Promise<boolean> {
        const img = await this.createImage(file);
        this.isSizeImageCorrect = img.width === SIZE.y && img.height === SIZE.x;
        return this.isSizeImageCorrect;
    }

    onSubmit(): void {
        switch ((this.form.get('type') as FormControl).value) {
            case this.typePropagateCanvasEvent.Both: {
                this.toolService.$uploadImageInDiff.next(this.img);
                this.toolService.$uploadImageInSource.next(this.img);
                break;
            }
            case this.typePropagateCanvasEvent.Difference: {
                this.toolService.$uploadImageInDiff.next(this.img);
                break;
            }
            case this.typePropagateCanvasEvent.Source: {
                this.toolService.$uploadImageInSource.next(this.img);
                break;
            }
            default: {
                return;
            }
        }
    }
}
