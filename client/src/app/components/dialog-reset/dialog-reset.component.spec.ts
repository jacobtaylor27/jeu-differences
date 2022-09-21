import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogResetComponent } from './dialog-reset.component';

describe('DialogResetComponent', () => {
  let component: DialogResetComponent;
  let fixture: ComponentFixture<DialogResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogResetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
