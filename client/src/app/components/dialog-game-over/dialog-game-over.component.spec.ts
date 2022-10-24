import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGameOverComponent } from './dialog-game-over.component';

describe('DialogGameOverComponent', () => {
  let component: DialogGameOverComponent;
  let fixture: ComponentFixture<DialogGameOverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogGameOverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogGameOverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
