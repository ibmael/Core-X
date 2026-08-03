import { Injectable, inject, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL, SKIP_ERROR } from 'auth';
import { Diploma, DiplomasApiResponse, SingleDiplomaApiResponse } from '../models/diploma.model';
import {
  Exam,
  ExamsApiResponse,
  Question,
  QuestionsApiResponse,
  SubmitExamRequest,
  SubmissionApiResponse,
} from '../models/exam.model';

@Injectable({ providedIn: 'root' })
export class DiplomaService {
  private http = inject(HttpClient);

  constructor(@Inject(API_URL) private apiUrl: string) {}

  private getSkipErrorContext(): HttpContext {
    return new HttpContext().set(SKIP_ERROR, true);
  }

  // ── Diplomas ──────────────────────────────────────────────────────────

  getDiplomas(
    page: number = 1,
    limit: number = 12,
    search: string = '',
    sortBy: string = 'createdAt',
    sortOrder: string = 'asc',
  ): Observable<{ data: Diploma[]; total: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    if (search) {
      params = params.set('search', search);
    }

    return this.http
      .get<DiplomasApiResponse>(`${this.apiUrl}/api/diplomas`, {
        params,
        context: this.getSkipErrorContext(),
      })
      .pipe(
        map((res) => ({
          data: res.payload?.data || [],
          total: res.payload?.metadata?.total || 0,
        })),
      );
  }

  getDiploma(id: string): Observable<Diploma> {
    return this.http
      .get<SingleDiplomaApiResponse>(`${this.apiUrl}/api/diplomas/${id}`, {
        context: this.getSkipErrorContext(),
      })
      .pipe(map((res) => res.diploma));
  }

  // ── Exams ─────────────────────────────────────────────────────────────

  getDiplomaExams(diplomaId?: string, search: string = ''): Observable<Exam[]> {
    let params = new HttpParams().set('limit', '100');
    if (diplomaId) {
      params = params.set('diplomaId', diplomaId);
    }
    if (search) {
      params = params.set('search', search);
    }

    return this.http
      .get<ExamsApiResponse>(`${this.apiUrl}/api/exams`, {
        params,
        context: this.getSkipErrorContext(),
      })
      .pipe(map((res) => res.payload?.data || []));
  }

  getExam(id: string): Observable<Exam> {
    return this.http
      .get<{ exam: Exam }>(`${this.apiUrl}/api/exams/${id}`, {
        context: this.getSkipErrorContext(),
      })
      .pipe(map((res) => res.exam));
  }

  // ── Questions ─────────────────────────────────────────────────────────

  getExamQuestions(examId: string): Observable<Question[]> {
    return this.http
      .get<QuestionsApiResponse>(`${this.apiUrl}/api/questions/exam/${examId}`, {
        context: this.getSkipErrorContext(),
      })
      .pipe(map((res) => res.payload?.questions || []));
  }

  // ── Submissions ───────────────────────────────────────────────────────

  submitExam(payload: SubmitExamRequest): Observable<SubmissionApiResponse['payload']> {
    return this.http
      .post<SubmissionApiResponse>(`${this.apiUrl}/api/submissions`, payload, {
        context: this.getSkipErrorContext(),
      })
      .pipe(map((res) => res.payload));
  }

  // ── Image Upload ──────────────────────────────────────────────────────

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http
      .post<unknown>(`${this.apiUrl}/api/upload`, formData, {
        context: this.getSkipErrorContext(),
      })
      .pipe(
        map((res) => {
          const raw = res as Record<string, unknown>;
          const payload = (raw?.['payload'] ?? raw?.['data'] ?? raw) as Record<string, unknown> | string;
          const url =
            (typeof payload === 'string' ? payload : null) ||
            (typeof payload === 'object' && payload
              ? (payload['url'] as string) ||
                (payload['imageUrl'] as string) ||
                (payload['path'] as string) ||
                (payload['location'] as string) ||
                (payload['secure_url'] as string)
              : null) ||
            (raw?.['url'] as string) ||
            (raw?.['imageUrl'] as string) ||
            '';

          return { url };
        }),
      );
  }
}
