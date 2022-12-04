import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimeFormatterService } from '@app/services/time-formatter/time-formatter.service';

import { DialogGameOverComponent } from './dialog-game-over.component';

describe('DialogGameOverComponent', () => {
    let component: DialogGameOverComponent;
    let fixture: ComponentFixture<DialogGameOverComponent>;
    let spyTimeFormatter: jasmine.SpyObj<TimeFormatterService>;

    beforeEach(async () => {
        spyTimeFormatter = jasmine.createSpyObj('TimeFormatterService', ['formatTimeForScore']);
    });

    it('should create', async () => {
        await TestBed.configureTestingModule({
            declarations: [DialogGameOverComponent],
            providers: [
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        win: true,
                        winner: 'test',
                        isClassic: true,
                        nbPoints: '0',
                        record: { index: 1, time: 0 },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogGameOverComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        expect(spyTimeFormatter.formatTimeForScore).toBeDefined();
        expect(component).toBeTruthy();
    });

    it('should be null when there is no record passed', async () => {
        await TestBed.configureTestingModule({
            declarations: [DialogGameOverComponent],
            providers: [
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        win: true,
                        winner: 'test',
                        isClassic: true,
                        nbPoints: '0',
                        record: null,
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogGameOverComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        expect(component.index).toBeNull();
        expect(component.time).toBeNull();
    });
});
