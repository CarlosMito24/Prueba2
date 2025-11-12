import { Component, OnInit } from '@angular/core';
import { Reserva } from '../../app/services/reserva';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
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
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
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

  /**
   * Muestra un diálogo de confirmación antes de eliminar una mascota.
   * @param mascotaId ID de la mascota a eliminar.
   */
  async confirmarEliminacion(mascotaId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Eliminación',
      message:
        '¿Estás seguro de que deseas eliminar esta mascota? Esta acción no se puede deshacer y se eliminarán sus datos asociados.',
      buttons: [
        {
          text: 'No, mantener',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Sí, Eliminar',
          handler: () => {
            this.eliminarMascota(mascotaId); 
          },
        },
      ],
    });
    await alert.present();
  }


  /**
   * Llama al servicio para eliminar la mascota y actualiza la lista.
   * @param id ID de la mascota a eliminar.
   */
  async eliminarMascota(id: number) {
    const loading = await this.loadingCtrl.create({
      message: 'Eliminando mascota...',
      spinner: 'crescent',
    });
    await loading.present();

    this.reservaService
      .eliminarMascota(id)
      .pipe(
        finalize(async () => {
          await loading.dismiss();
        }),
        catchError((error) => {
          this.mostrarToast(
            'Error al eliminar la mascota. Intente nuevamente.',
            'danger'
          );
          return of(null);
        })
      )
      .subscribe(() => {
        this.mostrarToast('Mascota eliminada correctamente.', 'success');
        this.cargarMascotas(); 
      });
  }
}