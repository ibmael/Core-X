import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedPassword } from './shared-password';

describe('SharedPassword', () => {
  let component: SharedPassword;
  let fixture: ComponentFixture<SharedPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedPassword],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedPassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
