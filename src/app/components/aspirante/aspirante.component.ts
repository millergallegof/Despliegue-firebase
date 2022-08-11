import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Aspirante } from 'src/app/models/aspirante';
import { AspiranteService } from 'src/app/services/aspirante.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aspirante',
  templateUrl: './aspirante.component.html',
  styleUrls: ['./aspirante.component.css'],
})
export class AspiranteComponent implements OnInit {
  formaDatos: FormGroup | any;
  formaCodigo: FormGroup | any;

  aspirante: any;

  constructor( private fb: FormBuilder,
              private aspiranteService: AspiranteService,
              private cookieService: CookieService,
              private router: Router ) {

    this.crearFormulario();
  }

  ngOnInit(): void {
    Swal.fire({
      icon: 'success',
      title: 'Bienvenido aspirante',
      text: 'Primero debes registrarte',
      
    })
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

  private validarEspacio(control: AbstractControl){
    var espacio = control.value;
    var error = null;
    if (!espacio.includes(" ")){
      error = "Debes escribir nommbre espacio apellido";
    }
    return error;
  }

  crearFormulario(){
    this.formaDatos = this.fb.group({
     
      nombre:['', [Validators.required, this.validarEspacio,Validators.minLength(9)]],
      email:['', [Validators.required, Validators.pattern('[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$')]]
    })

    this.formaCodigo = this.fb.group({
      codigo: [
        '',
        [Validators.required, Validators.minLength(5)]
      ],
    });
  }

  
  get nombreNoValido(){
    return this.formaDatos.get('nombre').invalid && this.formaDatos.get('nombre').touched;
  }

  get emailNoValido(){
    return this.formaDatos.get('email').invalid && this.formaDatos.get('email').touched;
  }

  get codigoNoValido(){
    return this.formaCodigo.get('codigo').invalid && this.formaCodigo.get('codigo').touched;
  }


  solicitarCodigo(){
    if(this.formaDatos.invalid){
      Object.values( this.formaDatos.controls ).forEach ((control: any)=> {
        control.markAsTouched();})
    } else {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Su código fue enviado al correo registrado',
        showConfirmButton: false,
        timer: 1500
      })

      this.crearAspirante()
    }
  }

  crearAspirante(){
    const data: Aspirante = {
      nombre: this.formaDatos.get('nombre').value,
      correo: this.formaDatos.get('email').value
    } 
    this.aspiranteService.crearAspirante(data).subscribe( data => console.log(data))
  }

  comenzar(){
    const codigoVerificacion = this.formaCodigo.get('codigo').value;
    
    this.obtenerAspirante(codigoVerificacion).subscribe(data => console.log(data));

    this.validarCodigo(codigoVerificacion)
    .then(data => {      
      if(data){ 
        this.alertaInstrucciones()
          .then( () => {
            this.timer();
            this.router.navigate(['/evaluacion/'+ this.aspirante.evaluacionId]);
          })
        
      }
    })

  }

  validarCodigo( codigoVerificacion: string ): Promise<any>{
    return new Promise ((resolve) => {
      this.obtenerAspirante(codigoVerificacion).subscribe(data => {
        this.aspirante = data;
        if(data != null){
          this.alertaCodigoCorrecto()
          resolve (true);
        } else {
          this.alertaCodigoIncorrecto()
          resolve (false);
        }
      });
    })
  }

  obtenerAspirante(codigoVerificacion: string){
    return this.aspiranteService.obtenerAspirantePorCodigoVerificacion(codigoVerificacion)
  }

  alertaCodigoCorrecto(){
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Código validado exitosamnete',
      showConfirmButton: false,
      timer: 2000
    })
  }

  alertaCodigoIncorrecto(){
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Código no válido, intente de nuevo.',
      showConfirmButton: false,
      timer: 2000
    })
  }

  async alertaInstrucciones(){
    await Swal.fire(
        'Instrucciones',
        `<p>Tendrás 1 hora para rendir la evaluación.</p>
        <p>Cada pregunta tiene un valor máximo de 2 puntos, con una valoración del 75% podrás pasar al siguiente nivel.</p>
        <p>No será posible regresar a una pregunta ya contestada.</p>
        <p>Tus resultados serán enviados directamente al correo electrónico que escribiste.</p>`,
        'info'
    ).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Puedes comenzar ahora',
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }


}

