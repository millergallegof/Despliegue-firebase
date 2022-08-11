import { AfterContentChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Aspirante } from 'src/app/models/aspirante';
import { AspiranteService } from 'src/app/services/aspirante.service';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css']
})
export class ResultadoComponent implements OnInit, AfterContentChecked {
  title = '¡Hola, futuro sofkiano!';
  idEvaluacion?: string;
  puntosPrueba1?: number;
  puntosPrueba2?: number;
  aspirante?: Aspirante;
  mensajeMostrar: string = '';
  fase: string = 'Canteras 2'
  valoracion?: number;
  nivel?: number;
  aprobado: string = '';
  valorBoton: string = ''


  constructor(
    private activateRoute: ActivatedRoute,
    private httpServiceAspirante: AspiranteService,
    private router: Router,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.idEvaluacion = this.activateRoute.snapshot.params['id'];
    this.obtenerAspirante()
    if (this.cookieService.get('prueba1')) {
      this.nivel = 2
    }
  }

  ngAfterContentChecked(): void {
    this.validarPuntos()
  }

  timer(): void {
    console.log("timer");
    let fechaActual = Date.parse(new Date().toString());
    let fechaFinal = fechaActual + 3601000;
    this.cookieService.set(
      'Fecha Inicio',
      JSON.stringify(fechaActual),
      new Date(fechaFinal)
    );
    this.cookieService.set(
      'Fecha Final',
      JSON.stringify(fechaFinal),
      new Date(fechaFinal)
    );
  }

  obtenerAspirante(): void {
    this.httpServiceAspirante.obtenerAspirantePorEvaluacion(this.idEvaluacion!)
      .subscribe(data => {
        this.aspirante = data
      })
  }
  validarPuntos(): void {
    this.valoracion = (this.aspirante?.puntajePrueba1! * 30) / 100
    if (this.nivel === 2) {
      this.mostrarNivel2()
    } else {
      this.mostrarNivel1()
    }
  }

  continuar(): void {
    this.timer()
    this.cookieService.set('prueba1', 'aprobada', this.limiteCookie(new Date()))
    this.router.navigate([`/evaluacion/${this.idEvaluacion}`])
  }

  finalizarPrueba(): void {
    this.httpServiceAspirante.enviarMensajeAspirante(
      this.aspirante?.id!, {
      nombre: this.aspirante?.nombre,
      valoracion: this.valoracion,
      fase: this.fase,
    }).subscribe(data => {
      this.router.navigate(['/inicio'])
      this.cookieService.deleteAll()
    })
  }

  limiteCookie(fecha: Date): Date {
    let fechalimite = Date.parse(fecha.toString()) + 3600000
    return new Date(fechalimite)
  }

  mostrarNivel1(): void {
    if (this.valoracion! >= 75) {
      this.valorBoton = 'Continuar'
      this.aprobado = 'evaluacion 1 completada'
    } else {
      this.valorBoton = 'Volver al Inicio'
      this.aprobado = 'evaluacion 1 perdida'
      this.fase = 'Canteras N1'
    }
  }

  mostrarNivel2(): void {
    if (this.valoracion! >= 75) {
      this.valorBoton = 'Volver al Inicio'
      this.aprobado = 'evaluacion 2 aprobada'
      this.fase = 'RETO FINAL'
    } else {
      this.valorBoton = 'Volver al Inicio'
      this.aprobado = 'evaluacion 2 perdida'
      this.fase = 'Canteras N2'
    }
  }

}
