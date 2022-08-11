import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Pregunta } from '../models/pregunta';
import { PathRest } from '../static/hostBackend';

@Injectable({
  providedIn: 'root',
})
export class PreguntasService {

  preguntaUrl: string = 'http://localhost:8080/api/pregunta/coach';


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private http: HttpClient) {}

  getPreguntas(): Observable<Pregunta[]> {
    return this.http
      .get<Pregunta[]>(this.preguntaUrl)
      .pipe(catchError(this.handleError<Pregunta[]>('getPreguntas', [])));
  }

  getPreguntasCoach(id: string): Observable<Pregunta[]> {
    return this.http
      .get<Pregunta[]>(`${PathRest.getApiPregunta}/coach/${id}`)
      .pipe(
        map((preguntas) => {
          preguntas.forEach(
            (p) =>
              (p.fechaActualizacion = new Date(
                `${p.fechaActualizacion[0]}-${p.fechaActualizacion[1]}-${p.fechaActualizacion[2]}`
              ))
          );
          return preguntas;
        })
      );
    // this.preguntaUrl.concat('coach/'+id)
    // .pipe(
    //   catchError(this.handleError<Pregunta[]>('getPreguntasCoach', []))
    // )
  }

  /** DELETE: delete the question from the server */
  deletePregunta(preguntaId: string | undefined): Observable<Pregunta> {
    const url = `${PathRest.getApiPregunta}/${preguntaId}`;
    return this.http.delete<Pregunta>(url, this.httpOptions).pipe(
      tap((_) => console.log(`deleted card cardId=${preguntaId}`)),
      catchError(this.handleError<Pregunta>('deleteCard'))
    );
  }

  /**Traer la pregunta con el id */
  getPreguntaId(id: string): Observable<Pregunta> {
    return this.http.get<Pregunta>(`${PathRest.getApiPregunta}/listar/${id}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  guardarPregunta(value: Pregunta): Observable<Pregunta> {
    console.log(value);
    return this.http.post<Pregunta>(
      `${PathRest.getApiPregunta}/guardar`,
      value
    );
  }

  actualizarPregunta(value: Pregunta): Observable<Pregunta> {
    let id = value.id;
    console.log(value);
    return this.http.put<Pregunta>(
      `${PathRest.getApiPregunta}/actualizar/${id}`,
      value
    );
  }
}
