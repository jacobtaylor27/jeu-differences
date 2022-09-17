import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFormsErrorComponent } from './dialog-forms-error.component';

describe('DialogFormsErrorComponent', () => {
  let component: DialogFormsErrorComponent;
  let fixture: ComponentFixture<DialogFormsErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFormsErrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogFormsErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
