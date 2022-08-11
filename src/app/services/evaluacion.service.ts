import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PathRest } from '../static/hostBackend';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {

  URLEvaluacion = "";

  constructor( private http: HttpClient ) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }), 
  };

  obtenerEvaluaciónPorId(idEvaluacion: string ){
    return this.http.get( `${PathRest.getApiEvaluacion}/${idEvaluacion}`,
    this.httpOptions);
  }

  
}
