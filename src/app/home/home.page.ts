import { Component, OnInit } from '@angular/core';
import { Reserva } from '../../app/services/reserva';
import { catchError, finalize } from 'rxjs/operators';
import { of, forkJoin, Observable} from 'rxjs';
import { AlertController, ToastController, LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  servicios: any[] = [];
  citaspendientes: any[] = [];

  constructor(
    private reservaService: Reserva,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
  ) {}

  ngOnInit() {
    this.cargarDatosConLoading(false); 
  }

  ionViewWillEnter() {
    this.cargarDatosConLoading(true); 
  }

  /**
   * Carga los datos (servicios y/o citas). Muestra LoadingController si es la carga inicial.
   * @param isRefresh Indica si es una recarga rápida (true) o una carga inicial (false).
   */
  async cargarDatosConLoading(isRefresh: boolean) {
    
    if (isRefresh) {
      this.cargarCitasPendientesRefresh();
      return;
    }
    
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading',
      message: 'Cargando datos...',
    });
    await loading.present();

    const peticiones: { [key: string]: Observable<any> } = {};

    peticiones['servicios'] = this.reservaService.getServicios().pipe(
      catchError((error) => {
        this.mostrarMensaje('No se pudieron cargar los servicios.', 'danger');
        return of([]);
      })
    );

    peticiones['citas'] = this.reservaService.getCitasPendientes().pipe(
      catchError((error) => {
        this.mostrarMensaje('No se pudieron cargar las citas pendientes.', 'danger');
        return of([]);
      })
    );
    
    forkJoin(peticiones)
    .pipe(
      finalize(() => { 
        loading.dismiss();
      })
    )
    .subscribe((resultados: any) => {
      this.servicios = resultados.servicios;
      this.citaspendientes = resultados.citas;
    });
  }

  cargarCitasPendientesRefresh() {
    this.reservaService
      .getCitasPendientes()
      .pipe(
        catchError((error) => {
          this.mostrarMensaje('Error al recargar citas.', 'danger');
          return of([]);
        })
      )
      .subscribe((data: any[]) => {
        this.citaspendientes = data;
      });
  }

  async confirmarCancelacion(citaId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Cancelación',
      message:
        '¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'No, mantener',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Sí, Cancelar',
          handler: () => {
            this.cancelarCita(citaId);
          },
        },
      ],
    });

    await alert.present();
  }

  cancelarCita(id: number) {
    this.reservaService.cancelarCita(id).subscribe({
      next: (res) => {
        this.mostrarMensaje(
          'Cita cancelada correctamente. ¡Lo sentimos!',
          'success'
        );
        this.citaspendientes = this.citaspendientes.filter(
          (cita) => cita.id !== id
        );
      },
      error: (err) => {
        this.mostrarMensaje(
          'Error al cancelar la cita. Revisa tu conexión o sesión.',
          'danger'
        );
      },
    });
  }

  async mostrarMensaje(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: color,
    });
    toast.present();
  }
}