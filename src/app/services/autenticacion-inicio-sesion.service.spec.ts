import { TestBed } from '@angular/core/testing';

import { AutenticacionInicioSesionService } from './autenticacion-inicio-sesion.service';

describe('AutenticacionInicioSesionService', () => {
  let service: AutenticacionInicioSesionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutenticacionInicioSesionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
