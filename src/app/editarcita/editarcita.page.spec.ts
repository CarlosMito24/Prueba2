import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarcitaPage } from './editarcita.page';

describe('EditarcitaPage', () => {
  let component: EditarcitaPage;
  let fixture: ComponentFixture<EditarcitaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarcitaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
