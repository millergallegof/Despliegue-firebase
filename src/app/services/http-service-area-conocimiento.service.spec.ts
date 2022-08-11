import { TestBed } from '@angular/core/testing';

import { HttpServiceAreaConocimientoService } from './http-service-area-conocimiento.service';

describe('HttpServiceAreaConocimientoService', () => {
  let service: HttpServiceAreaConocimientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpServiceAreaConocimientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
