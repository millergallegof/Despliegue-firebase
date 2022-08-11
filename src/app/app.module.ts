import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './components/inicio/inicio.component';


import { PreguntasService } from './services/preguntas.service';
import { TableroCoachComponent } from './components/tablero-coach/tablero-coach.component';
import { CreacionPreguntasComponentComponent } from './components/creacion-preguntas-component/creacion-preguntas-component.component';
import { HeaderComponentComponent } from './components/header-component/header-component.component';
import { FooterComponentComponent } from './components/footer-component/footer-component.component';
import { CookieService } from 'ngx-cookie-service';
import { EvaluacionComponent } from './components/evaluacion/evaluacion.component';
import { HttpClientModule } from '@angular/common/http';
import { PreguntaDetalleComponent } from './components/pregunta-detalle/pregunta-detalle.component';
import { AspiranteComponent } from './components/aspirante/aspirante.component';
import { EditarPreguntaComponent } from './components/editar-pregunta/editar-pregunta.component';
import { ResultadoComponent } from './components/resultado/resultado.component';

@NgModule({
  declarations: [
    AppComponent,
    EvaluacionComponent,
    InicioComponent,
    TableroCoachComponent,
    CreacionPreguntasComponentComponent,
    HeaderComponentComponent,
    FooterComponentComponent,
    PreguntaDetalleComponent,
    AspiranteComponent,
    EditarPreguntaComponent,
    ResultadoComponent
  ],

  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [PreguntasService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
