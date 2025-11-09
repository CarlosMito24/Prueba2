import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearcitaPage } from './crearcita.page';

describe('CrearcitaPage', () => {
  let component: CrearcitaPage;
  let fixture: ComponentFixture<CrearcitaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearcitaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
