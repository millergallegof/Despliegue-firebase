import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { TableroCoachComponent } from './components/tablero-coach/tablero-coach.component';
import { CreacionPreguntasComponentComponent } from './components/creacion-preguntas-component/creacion-preguntas-component.component';
import { EvaluacionComponent } from './components/evaluacion/evaluacion.component';
import { AspiranteComponent } from './components/aspirante/aspirante.component';
import { EditarPreguntaComponent } from './components/editar-pregunta/editar-pregunta.component';
import { ResultadoComponent } from "./components/resultado/resultado.component"

const routes: Routes = [

  { path: 'pregunta', component: EditarPreguntaComponent }, 
  { path: 'creacionpreguntas', component: CreacionPreguntasComponentComponent },
  {
    path: 'creacionpreguntas/:id',
    component: CreacionPreguntasComponentComponent,
  },
  { path: 'coach-dashboard', component: TableroCoachComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'aspirante', component: AspiranteComponent },
  { path: 'evaluacion/:id', component: EvaluacionComponent },
  { path: 'resultado/:id',component: ResultadoComponent },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
