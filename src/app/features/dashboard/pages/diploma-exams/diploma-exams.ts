import {
  Component, OnInit, inject, signal, computed, DestroyRef, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SkeletonModule } from 'primeng/skeleton';
import { MenuItem } from 'primeng/api';
import { DiplomaService } from '../../services/diploma.service';
import { Diploma } from '../../models/diploma.model';
import { Exam } from '../../models/exam.model';

@Component({
  selector: 'app-diploma-exams',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ButtonModule, BreadcrumbModule, SkeletonModule],
  templateUrl: './diploma-exams.html',
  styleUrl: './diploma-exams.css',
})
export class DiplomaExamsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private diplomaService = inject(DiplomaService);
  private destroyRef = inject(DestroyRef);

  diplomaId = signal<string>('');
  diploma = signal<Diploma | null>(null);
  initialStateTitle = signal<string>('');
  exams = signal<Exam[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  diplomaTitle = computed(() => {
    return this.diploma()?.title || this.initialStateTitle() || 'Diploma';
  });

  breadcrumbItems = computed<MenuItem[]>(() => [
    { label: 'Diplomas', routerLink: '/dashboard/diplomas' },
    { label: this.diplomaTitle() },
    { label: 'Exams' },
  ]);

  readonly fallbackLogos = [
    './icons/image%201.svg',
    './icons/image%202.svg',
    './icons/image%203.svg',
    './icons/image%204.svg',
    './icons/image%206.svg',
  ];

  getExamLogo(index: number): string {
    return this.fallbackLogos[index % this.fallbackLogos.length];
  }

  ngOnInit(): void {
    this.initializeFromRoute();
  }

  private initializeFromRoute(): void {
    const state = history.state;
    if (state?.title) {
      this.initialStateTitle.set(state.title);
    }
    const id = this.route.snapshot.paramMap.get('diplomaId') ?? '';
    this.diplomaId.set(id);
    this.loadData(id);
  }

  loadData(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.diplomaService.getDiploma(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (diploma) => this.diploma.set(diploma),
        error: () => {},
      });

    this.diplomaService.getDiplomaExams(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (exams) => {
          this.exams.set(exams);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Failed to load exams. Please try again.');
          this.isLoading.set(false);
        },
      });
  }

  startExam(exam: Exam): void {
    this.router.navigate(['/dashboard/diplomas', this.diplomaId(), 'exams', exam.id], {
      state: {
        diplomaTitle: this.diplomaTitle(),
        examTitle: exam.title,
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/diplomas']);
  }

  onLogoError(event: Event, index: number): void {
    const img = event.target as HTMLImageElement;
    const fallback = this.getExamLogo(index);
    if (img.src.includes('/icons/')) return;
    img.src = fallback;
  }

  skeletonItems = Array(5).fill(0);
}
