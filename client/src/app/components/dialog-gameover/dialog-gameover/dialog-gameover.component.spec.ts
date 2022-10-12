import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGameoverComponent } from './dialog-gameover.component';

describe('DialogGameoverComponent', () => {
  let component: DialogGameoverComponent;
  let fixture: ComponentFixture<DialogGameoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogGameoverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogGameoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
