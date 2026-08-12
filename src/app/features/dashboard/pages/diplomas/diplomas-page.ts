import { Component, OnInit, inject, signal, HostListener, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SkeletonModule } from 'primeng/skeleton';
import { MenuItem } from 'primeng/api';
import { DiplomaService } from '../../services/diploma.service';
import { Diploma } from '../../models/diploma.model';

@Component({
  selector: 'app-diplomas-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ButtonModule, BreadcrumbModule, SkeletonModule],
  templateUrl: './diplomas-page.html',
  styleUrl: './diplomas-page.css',
})
export class DiplomasPage implements OnInit {
  private diplomaService = inject(DiplomaService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  diplomas = signal<Diploma[]>([]);
  isLoading = signal(true);
  isLoadingMore = signal(false);
  hasMore = signal(true);
  error = signal<string | null>(null);

  totalRecords = signal(0);
  rows = signal(6);
  page = signal(1);

  breadcrumbItems: MenuItem[] = [{ label: 'Diplomas' }];

  readonly fallbackImages = [
    './icons/image%201.svg',
    './icons/image%202.svg',
    './icons/image%203.svg',
    './icons/image%204.svg',
    './icons/image%206.svg',
  ];

  ngOnInit(): void {
    this.loadInitialDiplomas();
  }

  loadInitialDiplomas(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.page.set(1);
    this.hasMore.set(true);

    this.diplomaService.getDiplomas(1, this.rows())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (res) => {
        this.diplomas.set(res.data);
        this.totalRecords.set(res.total || res.data.length);
        if (res.data.length < this.rows() || res.data.length >= (res.total || res.data.length)) {
          this.hasMore.set(false);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load diplomas. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  loadMore(): void {
    if (this.isLoading() || this.isLoadingMore() || !this.hasMore()) return;
    const nextPage = this.page() + 1;
    this.isLoadingMore.set(true);

    this.diplomaService.getDiplomas(nextPage, this.rows())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (res) => {
        this.page.set(nextPage);
        this.diplomas.update((old) => [...old, ...res.data]);
        if (res.data.length < this.rows() || this.diplomas().length >= (res.total || 0)) {
          this.hasMore.set(false);
        }
        this.isLoadingMore.set(false);
      },
      error: () => {
        this.isLoadingMore.set(false);
      },
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const threshold = 250;
    const pos = window.innerHeight + window.scrollY;
    const max = document.documentElement.scrollHeight;
    if (max - pos < threshold && !this.isLoading() && !this.isLoadingMore() && this.hasMore()) {
      this.loadMore();
    }
  }

  navigateToExams(diplomaId: string, title?: string): void {
    this.router.navigate(['/dashboard/diplomas', diplomaId, 'exams'], {
      state: { title },
    });
  }

  getGradientImage(index: number): string {
    return this.fallbackImages[index % this.fallbackImages.length];
  }

  onImageError(event: Event, index: number): void {
    const img = event.target as HTMLImageElement;
    if (img.src.includes('/icons/')) return;
    img.src = this.getGradientImage(index);
  }

  skeletonItems = Array(6).fill(0);
}
