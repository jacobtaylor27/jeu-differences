import { TestBed } from '@angular/core/testing';
import { CanvasType } from '@app/enums/canvas-type';

import { ToolBoxService } from './tool-box.service';

describe('ToolBoxService', () => {
    let service: ToolBoxService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolBoxService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add CanvasType', () => {
        const spyPencil = spyOn(service.$pencil, 'set');
        const spyUploadImage = spyOn(service.$uploadImage, 'set');
        const spyResetBackground = spyOn(service.$resetBackground, 'set');
        const spyResetForeground = spyOn(service.$resetForeground, 'set');
        const spySwitchForeground = spyOn(service.$switchForeground, 'set');
        service.addCanvasType(CanvasType.Left);
        expect(spyPencil).toHaveBeenCalled();
        expect(spyResetBackground).toHaveBeenCalled();
        expect(spyResetForeground).toHaveBeenCalled();
        expect(spyUploadImage).toHaveBeenCalled();
        expect(spySwitchForeground).toHaveBeenCalled();
    });
});
