import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material/slider';
import { Tool } from '@app/constant/tool';
import { Pencil } from '@app/interfaces/pencil';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { Subject } from 'rxjs';

import { ToolBoxComponent } from './tool-box.component';

describe('ToolBoxComponent', () => {
    let component: ToolBoxComponent;
    let fixture: ComponentFixture<ToolBoxComponent>;
    let toolBoxServiceSpyObj: jasmine.SpyObj<ToolBoxService>;
    beforeEach(async () => {
        toolBoxServiceSpyObj = jasmine.createSpyObj('ToolBoxService', [], { $pencil: new Subject() });
        await TestBed.configureTestingModule({
            declarations: [ToolBoxComponent],
            providers: [{ provide: ToolBoxService, useValue: toolBoxServiceSpyObj }],
        }).compileComponents();

        fixture = TestBed.createComponent(ToolBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
