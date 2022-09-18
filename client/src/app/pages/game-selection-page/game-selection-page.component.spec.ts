import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { GameSelectionPageComponent } from './game-selection-page.component';

describe('GameSelectionPageComponent', () => {
    let component: GameSelectionPageComponent;
    let fixture: ComponentFixture<GameSelectionPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameSelectionPageComponent],
            imports: [MatDialogModule],
        }).compileComponents();

        fixture = TestBed.createComponent(GameSelectionPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open dialog on click create game', () => {
        const spy = spyOn(component['matDialog'], 'open');
        component.onSelectCreateGame();
        expect(spy).toHaveBeenCalled();
    });

    it('should open dialog on click play game', () => {
        const spy = spyOn(component['matDialog'], 'open');
        component.onSelectPlayGame();
        expect(spy).toHaveBeenCalled();
    });

    it('GameSelectionService showNextFour() should be called when clicking next button', () => {
        const spy = spyOn(component['gameSelectionService'], 'showNextFour');
        component.onClickNext();
        expect(spy).toHaveBeenCalled();
    });

    it('GameSelectionService showPreviousFour() should be called when clicking previous button', () => {
        const spy = spyOn(component['gameSelectionService'], 'showPreviousFour');
        component.onClickPrevious();
        expect(spy).toHaveBeenCalled();
    });

    it('GameSelectionService hasPreviousCards() should be called to disable previous button', () => {
        const spy = spyOn(component['gameSelectionService'], 'hasPreviousCards');
        component.hasCardsBefore();
        expect(spy).toHaveBeenCalled();
    });

    it('GameSelectionService hasNextCards() should be called to disable next button', () => {
        const spy = spyOn(component['gameSelectionService'], 'hasNextCards');
        component.hasCardsAfter();
        expect(spy).toHaveBeenCalled();
    });

    it('GameSelectionService getActiveCards() should be called to get the card to the component', () => {
        const spy = spyOn(component['gameSelectionService'], 'getActiveCards');
        component.getGameCards();
        expect(spy).toHaveBeenCalled();
    });
});
