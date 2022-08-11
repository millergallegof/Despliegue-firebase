import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableroCoachComponent } from './tablero-coach.component';

describe('TableroCoachComponent', () => {
  let component: TableroCoachComponent;
  let fixture: ComponentFixture<TableroCoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableroCoachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableroCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
