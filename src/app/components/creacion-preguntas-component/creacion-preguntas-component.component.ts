import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AreaConocimiento } from 'src/app/models/areaConocimiento';
import { HttpServiceAreaConocimientoService } from 'src/app/services/http-service-area-conocimiento.service';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Descriptor } from 'src/app/models/descriptor';
import Swal from 'sweetalert2';
import { Opcion } from 'src/app/models/opcion';
import { Pregunta } from 'src/app/models/pregunta';
import { ActivatedRoute, Router } from '@angular/router';
import { PreguntasService } from 'src/app/services/preguntas.service';

@Component({
  selector: 'app-creacion-preguntas-component',
  templateUrl: './creacion-preguntas-component.component.html',
  styleUrls: ['./creacion-preguntas-component.component.css'],
})
export class CreacionPreguntasComponentComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('exampleModal') modal: ElementRef;
  title = 'Agregar Pregunta';
  tiposPregunta: string[] = [];
  areasConocimiento: string[] = [];
  descriptores: string[] = [];
  opcionesTipoPregunta: string[] = [
    'Opción múltiple',
    'Única opción',
    'Verdadero o falso',
  ];

  opcionesAreaConocimiento: AreaConocimiento[] = [];
  opcionesDescriptores?: Descriptor[];
  opciones: Opcion[] = [];
  opcion: string = '';
  tipoPregunta?: string;
  areaConocimientoNombre: string = '';
  areaConocimiento: AreaConocimiento;
  descriptor: string = '';
  pregunta?: string;
  preguntaForm: FormGroup;
  tieneOpcionesMultiples: boolean | null = null;
  botonAgregarOpcionDisable: boolean = true;
  checkboxEscorrectoDisable: boolean = true;
  requerimientosPregunta: ValidationErrors[] = [];
  opcionCorrecta: boolean = false;
  idPregunta: string;
  actualizar: boolean = false;

  preguntaAModificar: Pregunta;

  constructor(
    private fb: FormBuilder,
    private cookieService: CookieService,
    private router: Router,
    private servicioHttpAreaConocimiento: HttpServiceAreaConocimientoService,
    private activateRoute: ActivatedRoute,
    private preguntasService: PreguntasService
  ) {
    this.preguntaForm = this.fb.group({
      tipoPreguntaForm: [''],
      areaConocimientoForm: ['', Validators.required],
      descriptorForm: ['', Validators.required],
      preguntaFormulario: [
        '',
        [
          Validators.required,
          this.validarPregunta,
          this.validarPreguntaCaracterFinal,
        ],
      ],
      opcionForm: [''],
      opcionCorrectaForm: [''],
    });
    this.obtenerAreasConocimiento();
  }

  ngOnInit(): void {
    if (this.cookieService.get('checkRespuesta') !== '') {
      this.checkboxEscorrectoDisable = !Boolean(
        this.cookieService.get('checkRespuesta')
      );
    }
    if (this.cookieService.get('tipoPreguntaForm') !== '') {
      this.tipoPregunta = this.cookieService.get('tipoPreguntaForm');
    }
    if (this.cookieService.get('areaConocimientoForm') !== '') {
      console.log(this.cookieService.get('areaConocimientoForm'));
      this.areaConocimientoNombre = this.cookieService.get(
        'areaConocimientoForm'
      );
    }
    if (this.cookieService.get('descriptorForm') !== '') {
      this.descriptor = this.cookieService.get('descriptorForm');
    }
    if (JSON.parse(localStorage.getItem('opciones')!)) {
      this.opciones = JSON.parse(localStorage.getItem('opciones')!);
    }
    this.pregunta = this.cookieService.get('preguntaFormulario');
    this.traerInformacionActualizar();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.activateRoute.snapshot.params['id'])
        this.llenarFormularioActualizar();
      if (this.cookieService.get('areaConocimientoForm') !== '') {
        this.preguntaForm.controls['areaConocimientoForm'].setValue(
          this.areaConocimientoNombre
        );
      }
      if (this.cookieService.get('descriptorForm') !== '') {
        this.preguntaForm.controls['descriptorForm'].setValue(this.descriptor);
      }
    });
  }

  ngOnDestroy(): void {
    this.vaciarCamposPregunta();
  }

  // -------------------------------------------------------------------------------
  // Tipo de Pregunta
  // -------------------------------------------------------------------------------

  get tipopreguntaNoValida() {
    return (
      this.preguntaForm.get('tipoPreguntaForm')?.hasError('required') &&
      this.preguntaForm.get('tipoPreguntaForm')?.touched
    );
  }

  // -------------------------------------------------------------------------------
  // Area de Conocimiento
  // -------------------------------------------------------------------------------

  get areaConocimientoNoValida() {
    return (
      this.preguntaForm.get('areaConocimientoForm')?.hasError('required') &&
      this.preguntaForm.get('areaConocimientoForm')?.touched
    );
  }

  obtenerAreasConocimiento(): void {
    this.servicioHttpAreaConocimiento
      .listarAreaConocimiento()
      .subscribe((areas) => {
        areas.forEach((element) => {
          this.opcionesAreaConocimiento.push(element);
        });
      });
  }

  obtenerAreaConocimientoForm(idAreaconocimiento: string) {
    console.log(idAreaconocimiento);
  }

  // -------------------------------------------------------------------------------
  // Descriptor
  // -------------------------------------------------------------------------------

  get descriptorNoValida() {
    return (
      this.preguntaForm.get('descriptorForm')?.hasError('required') &&
      this.preguntaForm.get('descriptorForm')?.touched
    );
  }

  obtenerDescriptor(areaConocimiento: AreaConocimiento): void {
    let idArea = this.preguntaForm.value.areaConocimientoForm.id;
    this.opcionesAreaConocimiento.forEach((area) => {
      if (idArea === area.id) this.opcionesDescriptores = area.descriptores;
    });
  }

  // -------------------------------------------------------------------------------
  // Pregunta
  // -------------------------------------------------------------------------------

  traerInformacionActualizar() {
    this.idPregunta = this.activateRoute.snapshot.params['id'];
    if (this.idPregunta) {
      this.actualizar = true;
      this.preguntasService.getPreguntaId(this.idPregunta).subscribe((data) => {
        this.preguntaAModificar = data;
      });
    }
  }

  llenarFormularioActualizar() {
    console.log(this.preguntaAModificar);
    this.descriptor = this.preguntaAModificar.descriptor;
    this.preguntaForm.controls['tipoPreguntaForm'].setValue(
      this.preguntaAModificar.tipoPregunta
    );
    this.preguntaForm.controls['areaConocimientoForm'].setValue(
      this.preguntaAModificar.areaConocimiento
    );
    this.preguntaForm.controls['descriptorForm'].setValue(
      this.preguntaAModificar.descriptor
    );
    this.preguntaForm.controls['preguntaFormulario'].setValue(
      this.preguntaAModificar.pregunta
    );
    this.opciones = this.preguntaAModificar.opciones;
  }

  get preguntaFormNoValida() {
    return (
      this.preguntaForm.get('preguntaFormulario')?.hasError('required') &&
      this.preguntaForm.get('preguntaFormulario')?.touched
    );
  }

  get verdaderoFalsoValido() {
    return (
      this.preguntaForm.get('preguntaFormulario')?.errors?.[
      'validarPreguntaVerdaderoFalso'
      ] && this.preguntaForm.get('preguntaFormulario')?.touched
    );
  }

  vaciarCamposPregunta(): void {
    this.cookieService.deleteAll();
    localStorage.removeItem('opciones');
    this.preguntaForm.controls['tipoPreguntaForm'].setValue('');
    this.preguntaForm.controls['areaConocimientoForm'].setValue('');
    this.preguntaForm.controls['descriptorForm'].setValue('');
    this.preguntaForm.controls['preguntaFormulario'].setValue('');
    this.preguntaForm.controls['opcionForm'].setValue('');
    this.opciones = [];
    this.checkboxEscorrectoDisable = true;
  }

  mostrarRequerimientoPregunta(opcion: string): void {
    if (this.cookieService.get('tipoPreguntaForm') !== '') {
      if (this.cookieService.get('tipoPreguntaForm') !== opcion)
        this.vaciarCamposPregunta();
    }
    if (opcion === 'Verdadero o falso') {
      this.tieneOpcionesMultiples = false;
    } else {
      this.tieneOpcionesMultiples = true;
    }
    this.obtenerRequerimiento();
  }

  private validarPregunta(control: AbstractControl): ValidationErrors | null {
    let pregunta = control.value;
    if (
      !pregunta.startsWith('¿Qué') &&
      !pregunta.startsWith('¿Cómo') &&
      !pregunta.startsWith('¿Dónde') &&
      !pregunta.startsWith('¿Cuál') &&
      !pregunta.startsWith('¿Es')
    ) {
      return { validarPregunta: true };
    } else {
      return null;
    }
  }

  private validarPreguntaVerdaderoFalso(
    control: AbstractControl
  ): ValidationErrors | null {
    let pregunta = control.value;
    if (!pregunta.startsWith('Verdadero') && !pregunta.startsWith('Falso')) {
      return { validarPreguntaVerdaderoFalso: true };
    } else {
      return null;
    }
  }

  private validarPreguntaCaracterFinal(
    control: AbstractControl
  ): ValidationErrors | null {
    let pregunta = control.value;
    if (!pregunta.endsWith('?')) {
      return { validarPreguntaCaracterFinal: true };
    } else {
      return null;
    }
  }

  obtenerRequerimiento(): void {
    if (!this.tieneOpcionesMultiples) {
      this.preguntaForm.controls['preguntaFormulario'].setValidators([
        Validators.required,
        this.validarPreguntaVerdaderoFalso,
      ]);
    } else {
      this.preguntaForm.controls['preguntaFormulario'].setValidators([
        Validators.required,
        this.validarPregunta,
        this.validarPreguntaCaracterFinal,
      ]);
    }
  }

  // -------------------------------------------------------------------------------
  // Opcion
  // -------------------------------------------------------------------------------
  persistirOpcion(namekey: string) {
    let value = '';

    if (namekey === 'areaConocimientoForm')
      value =
        this.preguntaForm.value.areaConocimientoForm.nombreAreaConocimiento;
    if (namekey === 'tipoPreguntaForm')
      value = this.preguntaForm.value.tipoPreguntaForm;
    if (namekey === 'descriptorForm')
      value = this.preguntaForm.value.descriptorForm;
    if (namekey === 'preguntaFormulario')
      value = this.preguntaForm.value.preguntaFormulario;

    this.cookieService.set(
      namekey,
      value,
      this.obtenerLimiteCookie(new Date())
    );
  }

  obtenerLimiteCookie(fecha: Date): Date {
    return new Date(Date.parse(fecha.toString()) + 1200000);
  }

  validarOpcion(): void {
    if (this.preguntaForm.value.opcionForm) {
      this.botonAgregarOpcionDisable = false;
    } else {
      this.botonAgregarOpcionDisable = true;
    }
    this.validarEsEditar();
  }

  validarEsEditar(): void {
    if (this.cookieService.get('opcionEditar')) {
      this.botonAgregarOpcionDisable = false;
    } else {
      if (this.tipoPregunta !== 'Verdadero o falso') {
        this.validarPreguntaOpcionMultiple();
      } else {
        this.validarPreguntaVF();
      }
    }
  }

  validarPreguntaOpcionMultiple(): void {
    if (this.opciones.length >= 4) this.botonAgregarOpcionDisable = true;
  }

  validarPreguntaVF(): void {
    if (this.opciones.length >= 2) this.botonAgregarOpcionDisable = true;
  }

  obtenerCheck() {
    this.opcionCorrecta = this.preguntaForm.value.opcionCorrectaForm;
  }

  validacionOpcionesCorrecta(): void {
    let correcta = false;
    this.opciones.forEach((opcion) => {
      if (opcion.esCorrecto) {
        correcta = true;
      }
    });
    if (this.tipoPregunta === 'Verdadero o falso') {
      if (this.opciones.length >= 2 && !correcta) {
        Swal.fire({
          text: 'Hace falta agregar una opción correcta, agreguela y continue',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#dc3545',
          icon: 'error',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.opciones.splice(1);
          }
        });
      } else {
        localStorage.setItem('opciones', JSON.stringify(this.opciones));
        this.opcion = '';
      }
    } else {
      if (this.opciones.length >= 4 && !correcta) {
        Swal.fire({
          text: 'Hace falta agregar una opción correcta, agreguela y continue',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#dc3545',
          icon: 'error',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.opciones.splice(3);
          }
        });
      } else {
        localStorage.setItem('opciones', JSON.stringify(this.opciones));
        this.opcion = '';
      }
    }
  }

  agregarEditarOpcion() {
    let indice = this.cookieService.get('opcionEditar');
    if (indice) {
      let opcionEditar = {
        nombre: this.opcion,
        esCorrecto: this.opcionCorrecta,
      };
      this.validacionOpcionesCorrecta();
      this.opciones[parseInt(indice!)] = opcionEditar;
      localStorage.setItem('opciones', JSON.stringify(this.opciones));
      this.opcion = '';
    } else {
      let opcionEnviar = {
        nombre: this.opcion,
        esCorrecto: this.opcionCorrecta,
      };
      this.opciones.push(opcionEnviar);
      this.validacionOpcionesCorrecta();
    }
    this.cookieService.delete('opcionEditar');
    if (
      (this.tipoPregunta === 'Única opción' && this.opcionCorrecta) ||
      (this.tipoPregunta === 'Verdadero o falso' && this.opcionCorrecta)
    ) {
      this.cookieService.set(
        'checkRespuesta',
        'false',
        this.obtenerLimiteCookie(new Date())
      );
      this.checkboxEscorrectoDisable = false;
      this.opcionCorrecta = false;
    }
    this.preguntaForm.controls['opcionCorrectaForm'].setValue(false);
  }

  eliminarOpcion(opcion: string, esCorrecta: boolean) {
    Swal.fire({
      text: '¿Esta seguro de eliminar la opción?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: "Cancelar",
      cancelButtonColor: '#0d6efd',
      icon: 'question',
      confirmButtonColor: '#dc3545',
    }).then((result) => {
      if (result.isConfirmed) {
        if (esCorrecta) {
          this.checkboxEscorrectoDisable = true;
          this.cookieService.delete('checkRespuesta');
        }
        let item = this.opciones.findIndex(
          (element) => element.nombre == opcion
        );
        this.opciones.splice(item, 1);
        localStorage.setItem('opciones', JSON.stringify(this.opciones));
      }
    });
  }

  editarOpcion(indice: number) {
    Swal.fire({
      text: '¿Esta seguro de editar la opción?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: "Cancelar",
      cancelButtonColor: '#0d6efd',
      icon: 'question',
      confirmButtonColor: '#dc3545'
    }).then((result) => {
      if (result.isConfirmed) {
        this.opcion = this.opciones[indice].nombre;
        this.opcionCorrecta = this.opciones[indice].esCorrecto;
        this.preguntaForm.controls['opcionCorrectaForm'].setValue(
          this.opcionCorrecta
        );
        this.cookieService.set(
          'opcionEditar',
          indice.toString(),
          this.obtenerLimiteCookie(new Date())
        )
      }
    })
  }

  // -------------------------------------------------------------------------------
  // Botones guardar, validarGuardarPregunta y Regresar
  // -------------------------------------------------------------------------------
  validarGuardarPregunta(opciones: number, tipoPregunta: string) {
    let mensajeMultipleUnicaOpcion;
    let mensajeVerdaderoFalso;
    mensajeMultipleUnicaOpcion =
      (tipoPregunta == 'Opción múltiple' || tipoPregunta == 'Única opción') &&
        opciones == 4
        ? true
        : false;
    mensajeVerdaderoFalso =
      tipoPregunta == 'Verdadero o falso' && opciones == 2 ? true : false;
    return tipoPregunta === 'Verdadero o falso'
      ? mensajeVerdaderoFalso
      : mensajeMultipleUnicaOpcion;
  }

  guardarPregunta() {
    const tipoPreguntaValue: string = this.preguntaForm.value.tipoPreguntaForm;
    const areaConocimientoValue: string =
      this.preguntaForm.value.areaConocimientoForm.nombreAreaConocimiento;
    const descriptorValue: string = this.preguntaForm.value.descriptorForm;
    const preguntaFormularioValue: string =
      this.preguntaForm.value.preguntaFormulario;
    let opciones: Opcion[] = this.opciones;
    let cantidadPpciones = this.opciones.length;
    let mensaje = this.validarGuardarPregunta(
      cantidadPpciones,
      tipoPreguntaValue
    );
    let coachIdEnviar: string = JSON.parse(localStorage.getItem('usuario')!).id;
    if (this.idPregunta) {
      this.actualizarPreguntaCoach(
        tipoPreguntaValue,
        areaConocimientoValue,
        descriptorValue,
        preguntaFormularioValue,
        opciones,
        coachIdEnviar,
        this.idPregunta,
        mensaje
      );
    } else {
      if (mensaje) {
        Swal.fire({
          text: '¿Desea guardar la pregunta?',
          confirmButtonText: 'Guardar pregunta',
          confirmButtonColor: '#3085d6',
          cancelButtonText: "Cancelar",
          showCancelButton: true,
          cancelButtonColor: '#dc3545',
          icon: 'success',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.vaciarCamposPregunta();
            this.preguntasService
              .guardarPregunta({
                id: null,
                coachId: coachIdEnviar,
                fechaActualizacion: null,
                areaConocimiento: areaConocimientoValue,
                descriptor: descriptorValue,
                tipoPregunta: tipoPreguntaValue,
                pregunta: preguntaFormularioValue,
                opciones: opciones,
              })
              .subscribe(() => {
                this.router.navigate(['coach-dashboard']);
              });
          }
        });
      } else {
        Swal.fire({
          text: 'Ingrese las opciones correctamente',
          confirmButtonText: 'Salir',
          confirmButtonColor: '#dc3545',
          icon: 'error',
          allowOutsideClick: false,
        });
      }
    }
  }

  actualizarPreguntaCoach(
    tipoPreguntaValue: string,
    areaConocimientoValue: string,
    descriptorValue: string,
    preguntaFormularioValue: string,
    opciones: Opcion[],
    coachIdEnviar: string,
    idPregunta: string,
    mensaje: boolean
  ) {
    areaConocimientoValue == null
      ? (areaConocimientoValue = this.preguntaAModificar.areaConocimiento)
      : (areaConocimientoValue = areaConocimientoValue);
    console.log(areaConocimientoValue);
    if (mensaje) {
      Swal.fire({
        text: '¿Desea actualizar la pregunta?',
        confirmButtonText: 'Actualizar pregunta',
        confirmButtonColor: '#3085d6',
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        cancelButtonColor: '#dc3545',
        icon: 'success',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.vaciarCamposPregunta();
          this.preguntasService
            .actualizarPregunta({
              id: idPregunta,
              coachId: coachIdEnviar,
              fechaActualizacion: null,
              areaConocimiento: areaConocimientoValue,
              descriptor: descriptorValue,
              tipoPregunta: tipoPreguntaValue,
              pregunta: preguntaFormularioValue,
              opciones: opciones,
            })
            .subscribe(() => {
              this.router.navigate(['coach-dashboard']);
            });
        }
      });
    } else {
      Swal.fire({
        text: 'Ingrese las opciones correctamente',
        confirmButtonText: 'Salir',
        confirmButtonColor: '#dc3545',
        icon: 'error',
        allowOutsideClick: false,
      });
    }
  }

  regresar() {
    Swal.fire({
      text: '¿Está seguro que quiere volver? Aún no ha finalizado/agregado su pregunta.’',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: "Cancelar",
      cancelButtonColor: '#3085d6',
      icon: 'question',
      confirmButtonColor: '#dc3545',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['coach-dashboard']);
      }
    });
  }
}
