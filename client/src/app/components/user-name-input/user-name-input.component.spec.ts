import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNameInputComponent } from './user-name-input.component';

describe('UserNameInputComponent', () => {
  let component: UserNameInputComponent;
  let fixture: ComponentFixture<UserNameInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserNameInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserNameInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
