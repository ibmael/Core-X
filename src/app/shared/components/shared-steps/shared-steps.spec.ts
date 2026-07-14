import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSteps } from './shared-steps';

describe('SharedSteps', () => {
  let component: SharedSteps;
  let fixture: ComponentFixture<SharedSteps>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedSteps],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedSteps);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
