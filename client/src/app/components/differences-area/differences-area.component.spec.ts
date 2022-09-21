import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DifferencesAreaComponent } from './differences-area.component';

describe('DifferencesAreaComponent', () => {
  let component: DifferencesAreaComponent;
  let fixture: ComponentFixture<DifferencesAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DifferencesAreaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DifferencesAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
