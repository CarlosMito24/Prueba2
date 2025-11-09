import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubirmascotasPage } from './subirmascotas.page';

describe('SubirmascotasPage', () => {
  let component: SubirmascotasPage;
  let fixture: ComponentFixture<SubirmascotasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirmascotasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
