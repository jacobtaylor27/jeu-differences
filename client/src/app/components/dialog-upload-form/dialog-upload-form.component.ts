import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Vec2 } from '@app/interfaces/vec2';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

@Component({
    selector: 'app-dialog-upload-form',
    templateUrl: './dialog-upload-form.component.html',
    styleUrls: ['./dialog-upload-form.component.scss'],
})
export class DialogUploadFormComponent {
    size: Vec2 = { x: 480, y: 640 };
    form: FormGroup;
    isSizeImageCorrect: boolean = true;
    isTypeImageCorrect: boolean = true;
    img: ImageBitmap;
    isFormSubmitted: boolean = false;

    constructor(private toolService: ToolBoxService) {
        this.form = new FormGroup({
            type: new FormControl(null, Validators.required),
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

    async isImageCorrect(file: File): Promise<boolean> {
        return (await this.isSizeCorrect(file)) && this.isImageTypeCorrect(file);
    }

    async createImage(file: File): Promise<ImageBitmap> {
        return await createImageBitmap(file.slice());
    }

    isImageTypeCorrect(file: File): boolean {
        this.isTypeImageCorrect = file.type === 'image/bmp';
        return this.isTypeImageCorrect;
    }

    async isSizeCorrect(file: File): Promise<boolean> {
        const img = await this.createImage(file);
        this.isSizeImageCorrect = img.width === this.size.y && img.height === this.size.x;
        return this.isSizeImageCorrect;
    }

    onSubmit(): void {
        switch (this.form.get('type')?.value) {
            case 'both': {
                this.toolService.$uploadImageInDiff.next(this.img);
                this.toolService.$uploadImageInSource.next(this.img);
                break;
            }
            case 'diff': {
                this.toolService.$uploadImageInDiff.next(this.img);
                break;
            }
            case 'source': {
                this.toolService.$uploadImageInSource.next(this.img);
                break;
            }
            default: {
                return;
            }
        }
    }
}
