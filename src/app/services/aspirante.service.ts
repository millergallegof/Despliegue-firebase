import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Aspirante } from '../models/aspirante';
import { Mensaje } from '../models/mensaje';
import { PathRest } from '../static/hostBackend';

@Injectable({
  providedIn: 'root'
})
export class AspiranteService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  crearAspirante(aspirante: Aspirante) {
    return this.http.post(PathRest.getApiAspirante, aspirante, this.httpOptions);
  }

  obtenerAspirantePorCodigoVerificacion(CodigoVerificacion: string) {
    return this.http.get(`${PathRest.getApiAspirante}/comenzar/${CodigoVerificacion}`,
      this.httpOptions);
  }

  generarCodigoVerificacion(idAspirante: string) {
    return this.http.get(`${PathRest.getApiAspirante}/codigo/${idAspirante}`,
      this.httpOptions);
  }

  obtenerAspirantePorEvaluacion(idEvaluacion: string): Observable<Aspirante> {
    return this.http
      .get<Aspirante>
      (`${PathRest.getApiAspirante}/evaluacion/${idEvaluacion}`)
  }

  asignarPuntajeAspirante(idAspirante: string, aspirante: Aspirante): Observable<Aspirante> {
    return this.http
      .post<Aspirante>
      (`${PathRest.getApiAspirante}/evaluacion/${idAspirante}`, aspirante)
  }

  enviarMensajeAspirante(idAspirante: string, mensaje: Mensaje): Observable<Aspirante> {
    return this.http
      .post<Aspirante>
      (`${PathRest.getApiAspirante}/enviar-resultados/${idAspirante}`, mensaje)
  }

}
