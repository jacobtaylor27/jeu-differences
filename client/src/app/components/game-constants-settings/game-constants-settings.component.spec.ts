import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameConstantsSettingsComponent } from './game-constants-settings.component';

describe('GameConstantsSettingsComponent', () => {
  let component: GameConstantsSettingsComponent;
  let fixture: ComponentFixture<GameConstantsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameConstantsSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameConstantsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
