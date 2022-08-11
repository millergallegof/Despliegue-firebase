import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionPreguntasComponentComponent } from './creacion-preguntas-component.component';

describe('CreacionPreguntasComponentComponent', () => {
  let component: CreacionPreguntasComponentComponent;
  let fixture: ComponentFixture<CreacionPreguntasComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreacionPreguntasComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreacionPreguntasComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
