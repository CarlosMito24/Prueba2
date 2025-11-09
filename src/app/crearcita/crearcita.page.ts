import { Component, OnInit } from '@angular/core';
import { Reserva } from '../../app/services/reserva';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crearcita',
  templateUrl: './crearcita.page.html',
  styleUrls: ['./crearcita.page.scss'],
  standalone: false,
})
export class CrearcitaPage implements OnInit {
  cita = {
    fecha: '',
    hora: '',
    mascota_id: null as number | null,
    servicio_id: null as number | null,
    estado_id: 1,
  };

  servicios: any[] = [];
  mascotas: any[] = [];

  constructor(
    private reservaService: Reserva,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarServicios();
    this.cargarMascotas();
  }
  cargarServicios() {
    this.reservaService
      .getServicios()
      .pipe(
        catchError((error) => {
          console.error('Error al cargar servicios. ¿Token expirado?', error);
          this.mostrarToast(
            'No se pudieron cargar los servicios disponibles.',
            'danger'
          );
          this.servicios = [];
          return of([]);
        })
      )
      .subscribe((data: any[]) => {
        this.servicios = data;
      });
  }

  cargarMascotas() {
    this.reservaService
      .getMascotas()
      .pipe(
        catchError((error) => {
          console.error('Error al cargar mascotas. ¿Token expirado?', error);
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

  crearCita() {
    if (
      !this.cita.fecha ||
      !this.cita.hora ||
      !this.cita.mascota_id ||
      !this.cita.servicio_id
    ) {
      this.mostrarToast(
        'Por favor, selecciona Fecha, Hora, Mascota, Servicio y Estado.',
        'warning'
      );
      return;
    }

    const citaData = {
      fecha: this.cita.fecha.split('T')[0],
      hora: this.cita.hora.split('T')[1]?.substring(0, 5) || this.cita.hora,
      mascota_id: this.cita.mascota_id,
      servicios_id: this.cita.servicio_id,
      estado_id: this.cita.estado_id,
    };

    this.reservaService
      .subirCitas(citaData)
      .pipe(
        catchError((error) => {
          console.error('Error al registrar la cita:', error);
          const errorMessage =
            error.error?.message ||
            (error.status === 401
              ? 'Error de autenticación. Por favor, inicia sesión de nuevo.'
              : 'Error de conexión o del servidor. Intente más tarde.');
          this.mostrarToast(`Fallo en el registro: ${errorMessage}`, 'danger');
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          this.mostrarToast('Cita creada correctamente', 'success');
          this.router.navigate(['/citas']);

          this.cita = {
            fecha: '',
            hora: '',
            mascota_id: null,
            servicio_id: null,
            estado_id: 1,
          };
        }
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
