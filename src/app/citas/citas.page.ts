import { Component, OnInit } from '@angular/core';
import { Reserva } from '../../app/services/reserva';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
  standalone: false,
})
export class CitasPage implements OnInit {
   citascompletadas: any[] = [];
  constructor(private reservaService: Reserva) { }

  ngOnInit() {
    this.cargarCitasCompletadas();
  }

  cargarCitasCompletadas() {
      this.reservaService
        .getHistorialCitas()
        .pipe(
          catchError((error) => {
            console.error(
              'Error al cargar las citas pendientes. ¿Token expirado o error CORS?',
              console.error
            );
            this.citascompletadas = [];
            return of([]);
          })
        )
        .subscribe((data: any[]) => {
          this.citascompletadas = data;
          console.log(
            'Citas pendientes cargadas correctamente: ',
            this.citascompletadas
          );
        });
    }

}
