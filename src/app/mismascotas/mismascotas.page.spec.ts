import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MismascotasPage } from './mismascotas.page';

describe('MismascotasPage', () => {
  let component: MismascotasPage;
  let fixture: ComponentFixture<MismascotasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MismascotasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
