import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoUploadBmpComponent } from './demo-upload-bmp.component';

describe('DemoUploadBmpComponent', () => {
  let component: DemoUploadBmpComponent;
  let fixture: ComponentFixture<DemoUploadBmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoUploadBmpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoUploadBmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
