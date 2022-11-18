import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';

import { CheatModeService } from './cheat-mode.service';

describe('CheatModeService', () => {
    let service: CheatModeService;
    let differenceDetectionHandlerSpyObj: DifferencesDetectionHandlerService;
    beforeEach(() => {
        differenceDetectionHandlerSpyObj = jasmine.createSpyObj('DifferenceDetectionHandler', ['displayDifferenceTemp']);
        TestBed.configureTestingModule({
            imports: [AppMaterialModule, HttpClientModule, RouterTestingModule],
            providers: [{ provide: DifferencesDetectionHandlerService, useValue: differenceDetectionHandlerSpyObj }],
        });
        service = TestBed.inject(CheatModeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
