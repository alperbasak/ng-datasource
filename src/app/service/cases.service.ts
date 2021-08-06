import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CaseData} from '../interface/case-data';
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
  casesUrl = 'api/cases';  // URL to web api
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('CasesService');
  }

  /** GET cases from the server */
  getCases(): Observable<CaseData[]> {
    return this.http.get<CaseData[]>(this.casesUrl)
      .pipe(
        catchError(this.handleError('getCases', []))
      );
  }

  /* GET cases whose name contains search term */
  searchCases(term: string): Observable<CaseData[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
      { params: new HttpParams().set('name', term) } : {};

    return this.http.get<CaseData[]>(this.casesUrl, options)
      .pipe(
        catchError(this.handleError<CaseData[]>('searchCases', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new case to the database */
  addCase(caseData: CaseData): Observable<CaseData> {
    return this.http.post<CaseData>(this.casesUrl, caseData, httpOptions)
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
  updateCase(caseData: CaseData): Observable<CaseData> {
    httpOptions.headers =
      httpOptions.headers.set('Authorization', 'my-new-auth-token');

    return this.http.put<CaseData>(this.casesUrl, caseData, httpOptions)
      .pipe(
        catchError(this.handleError('updateCase', caseData))
      );
  }
}
