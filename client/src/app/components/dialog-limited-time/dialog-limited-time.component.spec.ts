import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLimitedTimeComponent } from './dialog-limited-time.component';

describe('DialogLimitedTimeComponent', () => {
  let component: DialogLimitedTimeComponent;
  let fixture: ComponentFixture<DialogLimitedTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogLimitedTimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogLimitedTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
