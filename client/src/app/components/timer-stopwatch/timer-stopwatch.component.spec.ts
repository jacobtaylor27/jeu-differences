import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerStopwatchComponent } from './timer-stopwatch.component';

describe('TimerStopwatchComponent', () => {
  let component: TimerStopwatchComponent;
  let fixture: ComponentFixture<TimerStopwatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimerStopwatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimerStopwatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
