import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Usuario } from '../models/usuario';
import { catchError, map, tap } from 'rxjs/operators';
import { PathRest } from '../static/hostBackend';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionInicioSesionService {
  private usuarioUrl = '/api/usuario/nombre-usuario';

  constructor(private httpClient: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  obtenerUsuarioPorNombreUsuario(nombreUsuario: string): Observable<Usuario> {
    return this.httpClient.get<Usuario>(
      `${PathRest.getApiUsuario}/nombre-usuario/${nombreUsuario}`,
      this.httpOptions
    );
  }

  /** GET send email with password. Will 404 if id not found */
  getSendEmail(userId: string | null): Observable<Usuario> {
    console.log(userId)
    const url = `${PathRest.getApiUsuario}/contrasena/${userId}`;
    return this.httpClient.get<Usuario>(url).pipe(
      tap(_ => console.log(`fetched user userId=${userId}`)),
      catchError(this.handleError<Usuario>(`getSendEmail userId=${userId}`))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };

  }
}
