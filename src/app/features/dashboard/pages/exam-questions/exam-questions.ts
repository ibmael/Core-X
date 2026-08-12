import {
  Component, OnInit, OnDestroy, inject, signal, computed, DestroyRef, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SkeletonModule } from 'primeng/skeleton';
import { MenuItem } from 'primeng/api';
import { DiplomaService } from '../../services/diploma.service';
import { Question, SubmissionAnalyticsItem, SubmissionData } from '../../models/exam.model';

@Component({
  selector: 'app-exam-questions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ButtonModule, ProgressBarModule, BreadcrumbModule, SkeletonModule],
  templateUrl: './exam-questions.html',
  styleUrl: './exam-questions.css',
})
export class ExamQuestionsPage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private diplomaService = inject(DiplomaService);
  private destroyRef = inject(DestroyRef);

  examId = signal<string>('');
  diplomaId = signal<string>('');
  examTitle = signal<string>('Exam');
  diplomaTitle = signal<string>('Diploma');

  questions = signal<Question[]>([]);
  currentQuestionIndex = signal<number>(0);
  answersMap = signal<Record<string, string>>({});

  isLoading = signal(true);
  isSubmitting = signal(false);
  error = signal<string | null>(null);

  submission = signal<SubmissionData | null>(null);
  analytics = signal<SubmissionAnalyticsItem[]>([]);

  breadcrumbItems = computed<MenuItem[]>(() => [
    { label: 'Diplomas', routerLink: '/dashboard/diplomas' },
    { label: this.diplomaTitle() },
    { label: this.examTitle() },
  ]);

  timeRemainingSeconds = signal<number>(300);
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  currentQuestion = computed(() => {
    const list = this.questions();
    const idx = this.currentQuestionIndex();
    return list.length > 0 && idx < list.length ? list[idx] : null;
  });

  progressPercent = computed(() => {
    const total = this.questions().length;
    if (total === 0) return 0;
    return Math.round(((this.currentQuestionIndex() + 1) / total) * 100);
  });

  formattedTime = computed(() => {
    const totalSec = this.timeRemainingSeconds();
    const mins = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const secs = (totalSec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  });

  timerOffset = computed(() => {
    const totalSec = 300;
    const remaining = this.timeRemainingSeconds();
    const circumference = 2 * Math.PI * 22;
    return circumference - (remaining / totalSec) * circumference;
  });

  readonly CIRCUMFERENCE = 2 * Math.PI * 52;

  ngOnInit(): void {
    this.initializeExam();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private initializeExam(): void {
    const state = history.state;
    if (state?.examTitle) this.examTitle.set(state.examTitle);
    if (state?.diplomaTitle) this.diplomaTitle.set(state.diplomaTitle);

    const examId = this.route.snapshot.paramMap.get('examId') ?? '';
    const diplomaId = this.route.snapshot.paramMap.get('diplomaId') ?? '';
    this.examId.set(examId);
    this.diplomaId.set(diplomaId);

    this.loadExamAndQuestions(examId);
    this.startTimer();
  }

  private startTimer(): void {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (this.timeRemainingSeconds() > 0) {
        this.timeRemainingSeconds.update((s) => s - 1);
      } else {
        this.stopTimer();
        if (!this.submission()) {
          this.submitExam();
        }
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  loadExamAndQuestions(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.diplomaService.getExam(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (exam) => {
          if (exam?.title) this.examTitle.set(exam.title);
          if (exam?.duration) this.timeRemainingSeconds.set(exam.duration * 60);
        },
      });

    this.diplomaService.getExamQuestions(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (questions) => {
          this.questions.set(questions);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Failed to load questions. Please try again.');
          this.isLoading.set(false);
        },
      });
  }

  selectOption(answerId: string): void {
    const q = this.currentQuestion();
    if (!q) return;
    this.answersMap.update((map) => ({ ...map, [q.id]: answerId }));
  }

  isSelected(answerId: string): boolean {
    const q = this.currentQuestion();
    if (!q) return false;
    return this.answersMap()[q.id] === answerId;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex() < this.questions().length - 1) {
      this.currentQuestionIndex.update((i) => i + 1);
    } else {
      this.submitExam();
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update((i) => i - 1);
    }
  }

  submitExam(): void {
    this.stopTimer();
    this.isSubmitting.set(true);

    const answersPayload = Object.entries(this.answersMap()).map(([qId, aId]) => ({
      questionId: qId,
      answerId: aId,
    }));

    this.diplomaService.submitExam({
      examId: this.examId(),
      answers: answersPayload,
      startedAt: new Date().toISOString(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.submission.set(res.submission);
          this.analytics.set(res.analytics);
          this.isSubmitting.set(false);
        },
        error: () => {
          this.isSubmitting.set(false);
        },
      });
  }

  restartExam(): void {
    this.submission.set(null);
    this.analytics.set([]);
    this.currentQuestionIndex.set(0);
    this.answersMap.set({});
    this.timeRemainingSeconds.set(300);
    this.startTimer();
    this.loadExamAndQuestions(this.examId());
  }

  goBack(): void {
    this.router.navigate(['/dashboard/diplomas', this.diplomaId(), 'exams'], {
      state: { title: this.diplomaTitle() },
    });
  }

  getGreenStrokeDashoffset(sub: SubmissionData): number {
    const total = sub.totalQuestions || (sub.correctAnswers + sub.wrongAnswers) || 1;
    const ratio = sub.correctAnswers / total;
    return this.CIRCUMFERENCE - ratio * this.CIRCUMFERENCE;
  }

  getRedStrokeDashoffset(sub: SubmissionData): number {
    const total = sub.totalQuestions || (sub.correctAnswers + sub.wrongAnswers) || 1;
    const ratio = sub.wrongAnswers / total;
    return this.CIRCUMFERENCE - ratio * this.CIRCUMFERENCE;
  }

  getRedRotationAngle(sub: SubmissionData): string {
    const total = sub.totalQuestions || (sub.correctAnswers + sub.wrongAnswers) || 1;
    const greenRatio = sub.correctAnswers / total;
    const angle = -90 + greenRatio * 360;
    return `rotate(${angle} 75 75)`;
  }
}
