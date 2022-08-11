import { Component, Input, OnInit } from '@angular/core';
import { Pregunta } from 'src/app/models/pregunta';

@Component({
  selector: 'app-pregunta-detalle',
  templateUrl: './pregunta-detalle.component.html',
  styleUrls: ['./pregunta-detalle.component.css']
})
export class PreguntaDetalleComponent implements OnInit {

  @Input () pregunta?: Pregunta;
  constructor() { }

  ngOnInit(): void {
  }

}
