import { Component, OnInit } from '@angular/core';
import { Reserva } from '../../app/services/reserva';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoadingController, ToastController } from '@ionic/angular';

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
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarCitasCompletadas();
  }

  ionViewWillEnter() {
    this.cargarCitasCompletadas();
  }

  async cargarCitasCompletadas() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading',
      message: 'Cargando historial...',
    });
    await loading.present();

    this.reservaService
      .getHistorialCitas()
      .pipe(
        catchError((error) => {
          let errorMessage =
            'Error de conexión. No se pudo cargar el historial.';
          if (error.status === 401) {
            errorMessage =
              'Sesión expirada. Por favor, inicia sesión de nuevo.';
          }
          this.mostrarToast(errorMessage, 'danger');

          this.citascompletadas = [];
          return of([]);
        }),
        finalize(async () => {
          await loading.dismiss();
        })
      )
      .subscribe((data: any[]) => {
        this.citascompletadas = data;
      });
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color,
      position: 'bottom',
    });
    toast.present();
  }
}
