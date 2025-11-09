import { Component, OnInit } from '@angular/core';
import { Reserva } from '../../app/services/reserva';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  servicios: any[] = [];
  citaspendientes: any[] = [];
  constructor(private reservaService: Reserva) {}

  ngOnInit() {
    this.cargarServicios();
    this.cargarCitasPendientes();
  }

  cargarServicios() {
    this.reservaService
      .getServicios()
      .pipe(
        catchError((error) => {
          console.error(
            'Error al cargar servicios. ¿Token expirado o error CORS?',
            error
          );
          this.servicios = [];
          return of([]);
        })
      )
      .subscribe((data: any[]) => {
        this.servicios = data;
        console.log('Servicios cargados correctamente:', this.servicios);
      });
  }

  cargarCitasPendientes() {
    this.reservaService
      .getCitasPendientes()
      .pipe(
        catchError((error) => {
          console.error(
            'Error al cargar las citas pendientes. ¿Token expirado o error CORS?',
            console.error
          );
          this.citaspendientes = [];
          return of([]);
        })
      )
      .subscribe((data: any[]) => {
        this.citaspendientes = data;
        console.log(
          'Citas pendientes cargadas correctamente: ',
          this.citaspendientes
        );
      });
  }
}
