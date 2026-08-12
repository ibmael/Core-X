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
import { UploadImageApiResponse, UploadImagePayload } from '../models/upload-image.model';

@Injectable({ providedIn: 'root' })
export class DiplomaService {
  private http = inject(HttpClient);

  constructor(@Inject(API_URL) private apiUrl: string) {}

  private getSkipErrorContext(): HttpContext {
    return new HttpContext().set(SKIP_ERROR, true);
  }


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


  getExamQuestions(examId: string): Observable<Question[]> {
    return this.http
      .get<QuestionsApiResponse>(`${this.apiUrl}/api/questions/exam/${examId}`, {
        context: this.getSkipErrorContext(),
      })
      .pipe(map((res) => res.payload?.questions || []));
  }


  submitExam(payload: SubmitExamRequest): Observable<SubmissionApiResponse['payload']> {
    return this.http
      .post<SubmissionApiResponse>(`${this.apiUrl}/api/submissions`, payload, {
        context: this.getSkipErrorContext(),
      })
      .pipe(map((res) => res.payload));
  }


  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http
      .post<UploadImageApiResponse>(`${this.apiUrl}/api/upload`, formData, {
        context: this.getSkipErrorContext(),
      })
      .pipe(
        map((res) => {
          const payload = res.payload ?? res.data ?? res;
          const url = this.extractUrl(payload) || res.url || res.imageUrl || '';
          return { url };
        }),
      );
  }

  private extractUrl(payload: UploadImagePayload | string | undefined): string | null {
    if (typeof payload === 'string') return payload;
    if (typeof payload === 'object' && payload) {
      return payload.url || payload.imageUrl || payload.path || payload.location || payload.secure_url || null;
    }
    return null;
  }
}
