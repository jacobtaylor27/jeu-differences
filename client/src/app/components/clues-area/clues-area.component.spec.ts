import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CluesAreaComponent } from './clues-area.component';

describe('CluesAreaComponent', () => {
    let component: CluesAreaComponent;
    let fixture: ComponentFixture<CluesAreaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CluesAreaComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CluesAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should ask for clue when i keyboard is pressed', () => {
        const getClueSpy = spyOn(component, 'getClue');
        const expectedKey = 'i';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        component.buttonDetect(buttonEvent);
        expect(getClueSpy).toHaveBeenCalled();
    });

    it('should not call clue when 3 clues have already been asked', () => {
        const componentInstance = fixture.componentInstance;
        const getClueSpy = spyOn(componentInstance, 'getClue');
        componentInstance.isDisabled = true;
        const expectedKey = 'i';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        componentInstance.buttonDetect(buttonEvent);
        expect(getClueSpy).not.toHaveBeenCalled();
    });
});
