import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DrawService } from '@app/services/draw-service/draw-service.service';

import { CommonToolBoxComponent } from './common-tool-box.component';

describe('CommonToolBoxComponent', () => {
    let component: CommonToolBoxComponent;
    let spyDialog: jasmine.SpyObj<MatDialog>;
    let spyDrawService: jasmine.SpyObj<DrawService>;
    let fixture: ComponentFixture<CommonToolBoxComponent>;

    beforeEach(async () => {
        spyDialog = jasmine.createSpyObj('MatDialog', ['open']);
        spyDrawService = jasmine.createSpyObj('DrawService', ['resetBackground']);
        await TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [
                { provide: MatDialog, useValue: spyDialog },
                { provide: DrawService, useValue: spyDrawService },
            ],
            declarations: [CommonToolBoxComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CommonToolBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open upload dialog', () => {
        component.openUploadDialog();
        expect(spyDialog.open).toHaveBeenCalled();
    });
});
