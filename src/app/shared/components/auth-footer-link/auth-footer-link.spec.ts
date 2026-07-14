import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFooterLink } from './auth-footer-link';

describe('AuthFooterLink', () => {
  let component: AuthFooterLink;
  let fixture: ComponentFixture<AuthFooterLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthFooterLink],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthFooterLink);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
