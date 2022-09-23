import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateGameComponent } from './dialog-create-game.component';

describe('DialogCreateGameComponent', () => {
  let component: DialogCreateGameComponent;
  let fixture: ComponentFixture<DialogCreateGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreateGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCreateGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
