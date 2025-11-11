import { Component, OnInit } from '@angular/core';
import { Reserva } from '../../app/services/reserva';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoadingController } from '@ionic/angular'; // <-- Importamos LoadingController

@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
  standalone: false,
})
export class CitasPage implements OnInit {
  citascompletadas: any[] = [];
  
  constructor(
    private reservaService: Reserva,
    private loadingCtrl: LoadingController // <-- Inyectamos LoadingController
  ) { }

  ngOnInit() {
    this.cargarCitasCompletadas();
  }

  ionViewWillEnter() {
    this.cargarCitasCompletadas();
  }

  async cargarCitasCompletadas() { // <-- Hacemos la función ASYNC
    
    // 1. Mostrar el indicador de carga
    const loading = await this.loadingCtrl.create({
      message: 'Cargando historial...',
    });
    await loading.present(); // Muestra el spinner

    this.reservaService
      .getHistorialCitas()
      .pipe(
        catchError((error) => {
          console.error(
            'Error al cargar el historial de citas.',
            error
          );
          this.citascompletadas = [];
          return of([]);
        }),
        // 2. Ocultar el indicador al finalizar, sin importar el resultado
        finalize(() => { 
          loading.dismiss(); // Oculta el spinner de forma garantizada
        }) 
      )
      .subscribe((data: any[]) => {
        this.citascompletadas = data;
        console.log(
          'Historial de citas cargado correctamente: ',
          this.citascompletadas
        );
      });
  }
}