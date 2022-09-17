import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitGameButtonComponent } from './exit-game-button.component';

describe('ExitGameButtonComponent', () => {
  let component: ExitGameButtonComponent;
  let fixture: ComponentFixture<ExitGameButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExitGameButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitGameButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
