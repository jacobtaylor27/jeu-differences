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

});
