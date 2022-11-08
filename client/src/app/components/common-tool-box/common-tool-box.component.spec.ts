import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CanvasType } from '@app/enums/canvas-type';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { Subject } from 'rxjs';

import { CommonToolBoxComponent } from './common-tool-box.component';

describe('CommonToolBoxComponent', () => {
    let component: CommonToolBoxComponent;
    let spyDialog: jasmine.SpyObj<MatDialog>;
    let spyDrawService: jasmine.SpyObj<DrawService>;
    let spyToolBoxService: jasmine.SpyObj<ToolBoxService>;
    let fixture: ComponentFixture<CommonToolBoxComponent>;

    beforeEach(async () => {
        spyDialog = jasmine.createSpyObj('MatDialog', ['open']);
        spyDrawService = jasmine.createSpyObj('DrawService', ['resetBackground']);
        spyToolBoxService = jasmine.createSpyObj('ToolBoxService', [], { $switchForeground: new Map() });
        await TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [
                { provide: MatDialog, useValue: spyDialog },
                { provide: DrawService, useValue: spyDrawService },
                { provide: ToolBoxService, useValue: spyToolBoxService },
            ],
            declarations: [CommonToolBoxComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CommonToolBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        spyToolBoxService.$switchForeground.set(CanvasType.Left, new Subject());
        spyToolBoxService.$switchForeground.set(CanvasType.Right, new Subject());
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open upload dialog', () => {
        component.openUploadDialog();
        expect(spyDialog.open).toHaveBeenCalled();
    });

    it('should swap foreground', () => {
        const spySwitchForegroundLeft = spyOn(spyToolBoxService.$switchForeground.get(CanvasType.Left) as Subject<void>, 'next');
        const spySwitchForegroundRight = spyOn(spyToolBoxService.$switchForeground.get(CanvasType.Right) as Subject<void>, 'next');
        component.swapForegrounds();
        expect(spySwitchForegroundLeft).toHaveBeenCalled();
        expect(spySwitchForegroundRight).toHaveBeenCalled();
    });
});
