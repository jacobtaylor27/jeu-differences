import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasSelectorComponent } from './canvas-selector.component';

describe('CanvasSelectorComponent', () => {
  let component: CanvasSelectorComponent;
  let fixture: ComponentFixture<CanvasSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
