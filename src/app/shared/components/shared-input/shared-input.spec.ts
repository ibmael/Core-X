import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInput } from './shared-input';

describe('SharedInput', () => {
  let component: SharedInput;
  let fixture: ComponentFixture<SharedInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedInput],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
