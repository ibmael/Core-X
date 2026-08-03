import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { AccountService } from '../../services/account.service';
import { DiplomaService } from '../../services/diploma.service';
import { SharedOtp } from '../../../../shared/components/shared-otp/shared-otp';
import { SharedPassword } from '../../../../shared/components/shared-password/shared-password';
import { SharedSteps } from '../../../../shared/components/shared-steps/shared-steps';
import { AuthErrorBanner } from '../../../../shared/components/auth-error-banner/auth-error-banner';
import { UserStateService } from '../../../../core/services/user-state.service';
import { AuthService, UpdateProfileRequest } from 'auth';

type ActiveTab = 'profile' | 'password';
type EmailStep = 'form' | 'otp';

@Component({
  selector: 'app-account',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    BreadcrumbModule,
    ConfirmDialogModule,
    SelectModule,
    SharedOtp,
    SharedPassword,
    SharedSteps,
    AuthErrorBanner,
  ],
  providers: [ConfirmationService],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class AccountPage implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private diplomaService = inject(DiplomaService);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private userState = inject(UserStateService);
  private router = inject(Router);
  private confirmation = inject(ConfirmationService);

  activeTab = signal<ActiveTab>('profile');
  isLoading = signal(true);
  profilePhotoUrl = signal('');
  photoFailed = signal(false);
  isUploadingPhoto = signal(false);
  showEmailModal = signal(false);
  showDeleteModal = signal(false);
  emailStep = signal<EmailStep>('form');
  isSavingProfile = signal(false);
  isSendingOtp = signal(false);
  isVerifyingOtp = signal(false);
  isChangingPass = signal(false);
  isDeleting = signal(false);
  passwordErrorBanner = signal<string | null>(null);
  resendCountdown = signal(0);
  otpValue = signal('');
  otpError = signal(false);
  currentEmail = signal('');

  private countdownId: ReturnType<typeof setInterval> | null = null;

  countryOptions = [{ label: 'EG(+20)', value: 'EG(+20)' }];

  breadcrumbItems = computed<MenuItem[]>(() => [
    { label: 'Account', routerLink: '/dashboard/account' },
    ...(this.activeTab() === 'password' ? [{ label: 'Change Password' }] : []),
  ]);

  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{ value: '', disabled: true }],
    phone: [''],
    countryCode: ['EG(+20)'],
  });

  emailForm = this.fb.group({
    newEmail: ['', [Validators.required, Validators.email]],
  });

  passwordForm = this.fb.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordMatchValidator },
  );

  ngOnInit(): void {
    const user = this.userState.currentUser();
    if (user?.profilePhoto) {
      this.profilePhotoUrl.set(user.profilePhoto);
    }
    this.loadProfile();
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  onTabChange(val: string | number | undefined): void {
    if (val === 'profile' || val === 'password') {
      this.activeTab.set(val);
    }
  }

  setTab(tab: ActiveTab): void {
    this.activeTab.set(tab);
  }

  loadProfile(): void {
    this.isLoading.set(true);
    this.authService.getProfile().subscribe({
      next: (res) => {
        const user = res?.user;
        if (!user) {
          this.isLoading.set(false);
          this.toastr.error('Failed to load profile');
          return;
        }

        this.profileForm.patchValue({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          username: user.username || '',
          phone: user.phone || '',
        });
        this.currentEmail.set(user.email || '');
        this.profilePhotoUrl.set(user.profilePhoto || '');
        this.userState.setUser(user);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toastr.error('Failed to load profile');
      },
    });
  }

  getUserInitials(): string {
    const first =
      this.profileForm.getRawValue().firstName || this.userState.currentUser()?.firstName || '';
    return first ? first.charAt(0).toUpperCase() : 'U';
  }

  formatSize(bytes: number): string {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  getImageUrl(url: string | undefined | null): string {
    return url?.trim() || '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.handleFile(file);
    }
    input.value = '';
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.handleFile(file);
    }
  }

  private handleFile(file: File): void {
    if (file.size > 5000000) {
      this.toastr.error('File size exceeds 5MB limit');
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.toastr.error('Please select a valid image file');
      return;
    }

    // Instant local preview
    const objectUrl = URL.createObjectURL(file);
    this.photoFailed.set(false);
    this.profilePhotoUrl.set(objectUrl);

    // Upload to server
    this.uploadPhoto(file);
  }

  private uploadPhoto(file: File): void {
    this.isUploadingPhoto.set(true);
    this.diplomaService.uploadImage(file).subscribe({
      next: (res) => {
        const url = res?.url?.trim();
        if (url) {
          this.photoFailed.set(false);
          this.profilePhotoUrl.set(url);
          this.toastr.success('Photo ready. Save changes to apply.');
        } else {
          this.toastr.error('Failed to upload photo');
        }
        this.isUploadingPhoto.set(false);
      },
      error: () => {
        this.toastr.error('Failed to upload photo');
        this.isUploadingPhoto.set(false);
      },
    });
  }

  removePhoto(): void {
    this.confirmation.confirm({
      header: 'Remove Photo',
      message: 'Remove your profile photo?',
      icon: 'pi pi-trash',
      acceptLabel: 'Remove',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.photoFailed.set(false);
        this.profilePhotoUrl.set('');
        this.toastr.info('Photo removed. Save changes to apply.');
      },
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const value = this.profileForm.getRawValue();
    const request: UpdateProfileRequest = {
      firstName: value.firstName || '',
      lastName: value.lastName || '',
      phone: value.phone || '',
      profilePhoto: this.profilePhotoUrl(),
    };

    this.isSavingProfile.set(true);
    this.authService.updateProfile(request).subscribe({
      next: (res) => {
        if (!res?.user) {
          this.toastr.error('Failed to update profile');
          this.isSavingProfile.set(false);
          return;
        }
        this.userState.setUser(res.user);
        this.profilePhotoUrl.set(res.user.profilePhoto || '');
        this.toastr.success('Profile updated successfully');
        this.isSavingProfile.set(false);
      },
      error: () => {
        this.toastr.error('Failed to update profile');
        this.isSavingProfile.set(false);
      },
    });
  }

  openEmailModal(): void {
    this.emailForm.reset({ newEmail: this.currentEmail() });
    this.otpValue.set('');
    this.otpError.set(false);
    this.emailStep.set('form');
    this.showEmailModal.set(true);
  }

  closeEmailModal(): void {
    this.stopCountdown();
    this.showEmailModal.set(false);
  }

  sendEmailOtp(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.isSendingOtp.set(true);
    this.accountService
      .requestEmailChange({ newEmail: this.emailForm.value.newEmail! })
      .subscribe({
        next: () => {
          this.emailStep.set('otp');
          this.isSendingOtp.set(false);
          this.startCountdown();
        },
        error: () => {
          this.toastr.error('Failed to send OTP');
          this.isSendingOtp.set(false);
        },
      });
  }

  confirmEmailChange(): void {
    if (this.otpValue().length < 5) {
      this.otpError.set(true);
      return;
    }

    this.isVerifyingOtp.set(true);
    this.accountService
      .confirmEmailChange({
        newEmail: this.emailForm.value.newEmail!,
        otp: this.otpValue(),
      })
      .subscribe({
        next: () => {
          this.currentEmail.set(this.emailForm.value.newEmail!);
          this.toastr.success('Email changed successfully');
          this.closeEmailModal();
          this.isVerifyingOtp.set(false);
        },
        error: () => {
          this.otpError.set(true);
          this.toastr.error('Invalid OTP');
          this.isVerifyingOtp.set(false);
        },
      });
  }

  changePassword(): void {
    this.passwordErrorBanner.set(null);
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isChangingPass.set(true);
    this.accountService
      .changePassword({
        currentPassword: this.passwordForm.value.currentPassword!,
        newPassword: this.passwordForm.value.newPassword!,
        confirmPassword: this.passwordForm.value.confirmPassword!,
      })
      .subscribe({
        next: () => {
          this.toastr.success('Your password has been updated.');
          this.passwordForm.reset();
          this.isChangingPass.set(false);
        },
        error: () => {
          this.passwordErrorBanner.set('Something went wrong');
          this.isChangingPass.set(false);
        },
      });
  }

  openDeleteModal(): void {
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
  }

  confirmDeleteAccount(): void {
    this.isDeleting.set(true);
    this.accountService.deleteAccount('password').subscribe({
      next: () => {
        this.toastr.success('Account deleted successfully.');
        this.isDeleting.set(false);
        this.closeDeleteModal();
        this.logout();
      },
      error: () => {
        this.toastr.error('Failed to delete account.');
        this.isDeleting.set(false);
      },
    });
  }

  logout(): void {
    this.userState.clearUser();
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  goBackToDiplomas(): void {
    this.router.navigate(['/dashboard/diplomas']);
  }

  isInvalid(form: 'profile' | 'email' | 'password', field: string): boolean {
    let ctrl: AbstractControl | null = null;
    if (form === 'profile') ctrl = this.profileForm.get(field);
    else if (form === 'email') ctrl = this.emailForm.get(field);
    else ctrl = this.passwordForm.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  passwordMismatch(): boolean {
    return !!(
      this.passwordForm.errors?.['mismatch'] &&
      this.passwordForm.get('confirmPassword')?.touched
    );
  }

  private startCountdown(): void {
    this.resendCountdown.set(60);
    this.stopCountdown();
    this.countdownId = setInterval(() => {
      if (this.resendCountdown() <= 1) {
        this.stopCountdown();
        this.resendCountdown.set(0);
        return;
      }
      this.resendCountdown.update((c) => c - 1);
    }, 1000);
  }

  private stopCountdown(): void {
    if (this.countdownId) {
      clearInterval(this.countdownId);
      this.countdownId = null;
    }
  }

  private passwordMatchValidator(group: AbstractControl) {
    const password = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }
}
