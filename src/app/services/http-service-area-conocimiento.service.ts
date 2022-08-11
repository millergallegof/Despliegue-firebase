import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AreaConocimiento } from '../models/areaConocimiento';
import { PathRest } from '../static/hostBackend';
import { Descriptor } from '../models/descriptor';
import { Pregunta } from '../models/pregunta';

@Injectable({
  providedIn: 'root',
})
export class HttpServiceAreaConocimientoService {
  constructor(private httpAreaConocimiento: HttpClient) {}

  listarAreaConocimiento(): Observable<AreaConocimiento[]> {
    return this.httpAreaConocimiento.get<AreaConocimiento[]>(
      `${PathRest.getApiAreaConocimiento}/listar`
    );
  }

  listarDescriptor(idDescriptor: string): Observable<Descriptor[]> {
    return this.httpAreaConocimiento.get<Descriptor[]>(
      `${PathRest.getApiAreaConocimiento}/descriptores/listar/${idDescriptor}`
    );
  }
}
