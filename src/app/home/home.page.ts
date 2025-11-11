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
  // Variable 'isLoading' eliminada, ahora usamos LoadingController.

  constructor(
    private reservaService: Reserva,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController // Inyectado
  ) {}

  ngOnInit() {
    // Carga inicial: usamos el loading modal completo
    this.cargarDatosConLoading(false); 
  }

  ionViewWillEnter() {
    // Refresco: Recargamos solo las citas, sin el loading modal (isRefresh = true)
    this.cargarDatosConLoading(true); 
  }

  /**
   * Carga los datos (servicios y/o citas). Muestra LoadingController si es la carga inicial.
   * @param isRefresh Indica si es una recarga rápida (true) o una carga inicial (false).
   */
  async cargarDatosConLoading(isRefresh: boolean) {
    
    // Si es solo un refresco de vista, usamos la función simple sin modal.
    if (isRefresh) {
      this.cargarCitasPendientesRefresh();
      return;
    }
    
    // Si no es refresco (carga inicial), mostramos el modal de carga.
    const loading = await this.loadingCtrl.create({
      message: 'Cargando datos...',
    });
    await loading.present();

    // 1. Prepara las peticiones
    const peticiones: { [key: string]: Observable<any> } = {};

    // Incluimos servicios y citas en la carga inicial (o si los servicios no existen)
    peticiones['servicios'] = this.reservaService.getServicios().pipe(
      catchError((error) => {
        console.error('Error al cargar servicios.', error);
        this.mostrarMensaje('No se pudieron cargar los servicios.', 'danger');
        return of([]);
      })
    );

    peticiones['citas'] = this.reservaService.getCitasPendientes().pipe(
      catchError((error) => {
        console.error('Error al cargar las citas pendientes.', error);
        this.mostrarMensaje('No se pudieron cargar las citas pendientes.', 'danger');
        return of([]);
      })
    );
    
    // 2. Ejecuta las peticiones con forkJoin
    forkJoin(peticiones)
    .pipe(
      // 3. Oculta el loading al finalizar (éxito o error)
      finalize(() => { 
        loading.dismiss();
      })
    )
    .subscribe((resultados: any) => {
      this.servicios = resultados.servicios;
      this.citaspendientes = resultados.citas;
      console.log('Carga inicial completa:', resultados);
    });
  }

  /**
   * Recarga solo las citas pendientes (usado en ionViewWillEnter) sin modal de carga.
   */
  cargarCitasPendientesRefresh() {
    this.reservaService
      .getCitasPendientes()
      .pipe(
        catchError((error) => {
          console.error('Error al recargar citas pendientes.', error);
          this.mostrarMensaje('Error al recargar citas.', 'danger');
          return of([]);
        })
      )
      .subscribe((data: any[]) => {
        this.citaspendientes = data;
        console.log('Citas pendientes refrescadas.');
      });
  }

  // Las funciones antiguas cargarServicios() y cargarCitasPendientes() han sido reemplazadas.
  cargarServicios() {}
  cargarCitasPendientes() {}

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
    // 1. Llama al método del servicio
    this.reservaService.cancelarCita(id).subscribe({
      next: (res) => {
        this.mostrarMensaje(
          'Cita cancelada correctamente. ¡Lo sentimos!',
          'success'
        );

        // 2. Actualizar la lista en el Frontend inmediatamente (sin recargar todo)
        // Filtramos la lista para que solo muestre las citas que no tienen ese ID.
        this.citaspendientes = this.citaspendientes.filter(
          (cita) => cita.id !== id
        );
      },
      error: (err) => {
        console.error('Error al cancelar la cita:', err);
        // El error 404/403 significa que el backend falló o no encontró la cita
        this.mostrarMensaje(
          'Error al cancelar la cita. Revisa tu conexión o sesión.',
          'danger'
        );
      },
    });
  }

  // Función genérica para mostrar mensajes
  async mostrarMensaje(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: color,
    });
    toast.present();
  }
}