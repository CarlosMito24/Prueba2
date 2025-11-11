import { Component, OnInit } from '@angular/core';
import { Reserva } from '../../app/services/reserva';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastController, LoadingController } from '@ionic/angular'; // <-- Importamos LoadingController
import { Router } from '@angular/router';

@Component({
  selector: 'app-mismascotas',
  templateUrl: './mismascotas.page.html',
  styleUrls: ['./mismascotas.page.scss'],
  standalone: false,
})
export class MismascotasPage implements OnInit {
  mascotas: any[] = [];

  constructor(
    private reservaService: Reserva,
    private toastCtrl: ToastController,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.cargarMascotas();
  }

  async cargarMascotas() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando tus mascotas...',
      spinner: 'crescent',
    });
    await loading.present();

    this.reservaService
      .getMascotas()
      .pipe(
        finalize(async () => {
          await loading.dismiss();
        }),
        catchError((error) => {
          this.mostrarToast(
            'No se pudieron cargar sus mascotas disponibles.',
            'danger'
          );
          this.mascotas = [];
          return of([]);
        })
      )
      .subscribe((data: any[]) => {
        this.mascotas = data;
      });
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      color,
      position: 'bottom',
    });
    toast.present();
  }
}
