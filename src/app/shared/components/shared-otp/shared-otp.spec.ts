import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedOtp } from './shared-otp';

describe('SharedOtp', () => {
  let component: SharedOtp;
  let fixture: ComponentFixture<SharedOtp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedOtp],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedOtp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
