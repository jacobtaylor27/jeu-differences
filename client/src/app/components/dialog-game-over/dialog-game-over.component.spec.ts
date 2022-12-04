import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimeFormatterService } from '@app/services/time-formatter/time-formatter.service';

import { DialogGameOverComponent } from './dialog-game-over.component';

describe('DialogGameOverComponent', () => {
    let component: DialogGameOverComponent;
    let fixture: ComponentFixture<DialogGameOverComponent>;
    let spyTimeFormatter: jasmine.SpyObj<TimeFormatterService>;

    beforeEach(async () => {
        const model = {
            isWin: false,
            record: {
                index: 1,
                time: 10,
            },
        };
        spyTimeFormatter = jasmine.createSpyObj('TimeFormatterService', ['formatTime']);
        await TestBed.configureTestingModule({
            declarations: [DialogGameOverComponent],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: model }],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogGameOverComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(spyTimeFormatter.formatTime).toBeDefined();
        expect(component).toBeTruthy();
    });
});
