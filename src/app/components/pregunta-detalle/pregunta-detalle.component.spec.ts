import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntaDetalleComponent } from './pregunta-detalle.component';

describe('PreguntaDetalleComponent', () => {
  let component: PreguntaDetalleComponent;
  let fixture: ComponentFixture<PreguntaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreguntaDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreguntaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
