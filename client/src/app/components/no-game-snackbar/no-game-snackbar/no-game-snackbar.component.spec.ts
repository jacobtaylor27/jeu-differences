import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoGameSnackbarComponent } from './no-game-snackbar.component';

describe('NoGameSnackbarComponent', () => {
  let component: NoGameSnackbarComponent;
  let fixture: ComponentFixture<NoGameSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoGameSnackbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoGameSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
