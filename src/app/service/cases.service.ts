import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CaseEvent} from '../interface/case-event';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import {catchError} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    Authorization: 'my-auth-token'
  })
};

@Injectable()
export class CasesService {
  casesUrl = 'http://localhost:9000/case/';  // URL to web api
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('CasesService');
  }

  /** GET cases from the server */
  getCases(): Observable<CaseEvent[]> {
    return this.http.get<CaseEvent[]>(this.casesUrl)
      .pipe(
        catchError(this.handleError('getCases', []))
      );
  }

  /* GET cases whose name contains search term */
  searchCases(term: string): Observable<CaseEvent[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
      { params: new HttpParams().set('name', term) } : {};

    return this.http.get<CaseEvent[]>(this.casesUrl, options)
      .pipe(
        catchError(this.handleError<CaseEvent[]>('searchCases', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new case to the database */
  addCase(caseData: CaseEvent): Observable<CaseEvent> {
    return this.http.post<CaseEvent>(this.casesUrl, caseData, httpOptions)
      .pipe(
        catchError(this.handleError('addCase', caseData))
      );
  }

  /** DELETE: delete the case from the server */
  deleteCase(id: number): Observable<unknown> {
    const url = `${this.casesUrl}/${id}`; // DELETE api/cases/42
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteCase'))
      );
  }

  /** PUT: update the caseData on the server. Returns the updated caseData upon success. */
  updateCase(caseData: CaseEvent): Observable<CaseEvent> {
    httpOptions.headers =
      httpOptions.headers.set('Authorization', 'my-new-auth-token');

    return this.http.put<CaseEvent>(this.casesUrl, caseData, httpOptions)
      .pipe(
        catchError(this.handleError('updateCase', caseData))
      );
  }
}
