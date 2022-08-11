import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { interval, Subscription } from 'rxjs';
import { Evaluacion } from 'src/app/models/evaluacion';
import { Pregunta } from 'src/app/models/pregunta';
import { EvaluacionService } from 'src/app/services/evaluacion.service';

@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.component.html',
  styleUrls: ['./evaluacion.component.css'],
})
export class EvaluacionComponent implements OnInit {

  private subscripcion: Subscription;
  timeDifference: number;
  secondsToDday: number;
  minutesToDday: number;
  fechaActual: Date = new Date();
  fechaFinal: Date;
  milliSecondsInASecond: number = 1000;
  minutesInAnHour: number = 60;
  SecondsInAMinute: number = 60;

  puntaje : number = 0;
  forma: FormGroup | any;

  idEvaluacion = this.activateRoute.snapshot.params['id'];
  evaluacion: any;

  preguntas: Pregunta[] = [];

  indexPregunta = 0;
  preguntaMostrada: Pregunta;

  constructor(private fb: FormBuilder,
              private cookieService: CookieService,
              private evaluacionService: EvaluacionService,
              private activateRoute: ActivatedRoute) {

    this.crearFormulario();
    this.obtenerEvaluacion();
  }

  ngOnInit(): void {
    this.fechaFinal = new Date(parseInt(this.cookieService.get('Fecha Final')));
    this.subscripcion = interval(1000).subscribe((elemento) => {
      this.getTimeDifference();
      if (this.minutesToDday === 0 && this.secondsToDday === 0) {
        this.subscripcion.unsubscribe();
        //TODO LLamar al método que finaliza la evaluación, el del botón finalizar
      }
    });
  }

  private getTimeDifference() {
    this.timeDifference = this.fechaFinal.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference: number) {
    this.secondsToDday = Math.floor(
      (timeDifference / this.milliSecondsInASecond) % this.SecondsInAMinute
    );
    this.minutesToDday = Math.floor(
      (timeDifference / (this.milliSecondsInASecond * this.minutesInAnHour)) %
        this.SecondsInAMinute
    );
  }

  get preguntaNoValida() {
    if (this.preguntaMostrada.tipoPregunta == 'Opción múltiple') {
      return this.forma.get('multiple').invalid;
    }
    return this.forma.get('pregunta').invalid;
  }

  crearFormulario(){
    this.forma = this.fb.group({
          multiple: this.fb.group({
            op0: [''],
            op1: [''],
            op2: [''],
            op3: ['']
          },  Validators.required)
          ,
          pregunta: ['', Validators.required]
        });
  }

  obtenerEvaluacion(){
    return this.evaluacionService.obtenerEvaluaciónPorId(this.idEvaluacion)
    .subscribe(evaluacion => {
      this.evaluacion = evaluacion;
      this.cargarPreguntas();
      this.preguntaMostrada = this.preguntas[this.indexPregunta]
    })
  }

  cargarPreguntas(){
    this.preguntas = this.evaluacion.preguntaList1
  }

  siguientePregunta() {
    this.crearFormulario();
    this.indexPregunta++;
    this.preguntaMostrada = this.preguntas[this.indexPregunta];
    console.log(this.preguntaMostrada);
  }

  enviarEvaluacion() {
    this.verificarRespuesta();
    this.siguientePregunta();
    console.log(this.forma);
  }

  verificarRespuesta() {
    switch(this.preguntaMostrada.tipoPregunta){
      case('Verdadero o falso'): {
        this.verificarRespuestaVoF()
        break;
      }

      case('Única opción'):{
        this.verificarRespuestaUnica();
        break;
      }

      case('Opción múltiple'):{
          this.verificarRespuestaMultiple();
          break;
      }

      default:{
        console.log("Pregunta INVALIDA");
        break;
      }
    }
  }
  verificarRespuestaVoF() {
    if(this.forma.value.pregunta == "true"){
      this.puntaje +=2;
    }
  }

  verificarRespuestaMultiple() {
    let opcionesMarcadas = this.forma.value.multiple;
    let flag = true;

    if(this.preguntaMostrada.opciones[0].esCorrecto == true){
      if(opcionesMarcadas.op0 != true){
        flag = false;
      }
    }else{
      if(opcionesMarcadas.op0 == true){
        flag = false;
      }
    }

    if(this.preguntaMostrada.opciones[1].esCorrecto == true){
      if(opcionesMarcadas.op1 != true){
        flag = false;
      }
    }else{
      if(opcionesMarcadas.op1 == true){
        flag = false;
      }
    }

    if(this.preguntaMostrada.opciones[2].esCorrecto == true){
      if(opcionesMarcadas.op2 != true){
        flag = false;
      }
    }else{
      if(opcionesMarcadas.op2 == true){
        flag = false;
      }
    }

    if(this.preguntaMostrada.opciones[3].esCorrecto == true){
      if(opcionesMarcadas.op3 != true){
        flag = false;
      }
    }else{
      if(opcionesMarcadas.op3 == true){
        flag = false;
      }
    }

    if(flag == true){
      this.puntaje+=2;
    }
    alert(this.puntaje);

  }

  verificarRespuestaUnica() {
    let index = parseInt(this.forma.value.pregunta);
    let opcionSeleccionada = this.preguntaMostrada.opciones[index];

    if(opcionSeleccionada.esCorrecto == true){
      this.puntaje += 2;
    }
  }

  imprimir() {
    console.log(this.evaluacion);
    console.log(this.preguntas);
    console.log(this.preguntaMostrada);
    console.log(this.forma);
  }
}
