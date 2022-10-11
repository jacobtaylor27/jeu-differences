import { Component } from '@angular/core';
import { BMP_HEADER_OFFSET, FORMAT_IMAGE, IMAGE_TYPE, SIZE } from '@app/constants/canvas';
import { PropagateCanvasEvent } from '@app/enums/propagate-canvas-event';
import { ImageCorrect } from '@app/interfaces/image-correct';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

@Component({
    selector: 'app-dialog-upload-form',
    templateUrl: './dialog-upload-form.component.html',
    styleUrls: ['./dialog-upload-form.component.scss'],
})
export class DialogUploadFormComponent {
    isCanvasUpload = { draw: false, compare: false };
    isPropertiesImageCorrect: ImageCorrect = { size: true, type: true, format: true };
    img: ImageBitmap;
    isFormSubmitted: boolean = false;
    typePropagateCanvasEvent: typeof PropagateCanvasEvent = PropagateCanvasEvent;

    constructor(private toolService: ToolBoxService) {}

    async uploadImage(event: Event) {
        const files: FileList = (event.target as HTMLInputElement).files as FileList;
        this.isFormSubmitted = await this.isImageCorrect(files[0]);
        if (files === null || !this.isFormSubmitted) {
            return;
        }

        this.img = await this.createImage(files[0]);
    }

    isImageFormatCorrect(bmpFormat: number) {
        return (this.isPropertiesImageCorrect.format = bmpFormat === FORMAT_IMAGE);
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
        return (this.isPropertiesImageCorrect.type = file.type === IMAGE_TYPE);
    }

    async isSizeCorrect(file: File): Promise<boolean> {
        const img = await this.createImage(file);
        return (this.isPropertiesImageCorrect.size = img.width === SIZE.x && img.height === SIZE.y);
    }

    onSubmit(): void {
        if (!this.isCanvasUpload.draw && !this.isCanvasUpload.compare) {
            return;
        }
        if (this.isCanvasUpload.draw) {
            this.toolService.$uploadImageInDiff.next(this.img);
        }
        if (this.isCanvasUpload.compare) {
            this.toolService.$uploadImageInSource.next(this.img);
        }
    }
}
