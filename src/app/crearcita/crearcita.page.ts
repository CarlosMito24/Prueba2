import { Component, OnInit } from '@angular/core';
import { Reserva } from '../../app/services/reserva';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
// import axios from 'axios'; <-- Eliminado, ya no es necesario

@Component({
  selector: 'app-crearcita',
  templateUrl: './crearcita.page.html',
  styleUrls: ['./crearcita.page.scss'],
  standalone: false,
})
export class CrearcitaPage implements OnInit {
  // Eliminamos 'apiUrl' ya que el servicio Reserva lo maneja.

  // Ajustamos el modelo para usar tipos más estrictos y nullables
  cita = {
    fecha: '',
    hora: '',
    mascota_id: null as number | null,
    servicio_id: null as number | null,
    estado_id: 1,
  };

  // Propiedades para almacenar las listas que se cargan del servidor
  servicios: any[] = [];
  mascotas: any[] = [];

  constructor(
    private reservaService: Reserva,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    // Es crucial cargar los servicios y otros datos al iniciar
    this.cargarServicios();
    this.cargarMascotas();
    // Si tienes un endpoint para cargar mascotas o estados, deberías llamarlos aquí:
    // this.cargarMascotas();
  }

  /**
   * Carga la lista de servicios disponibles para el select en el formulario.
   */
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
    // Validación mejorada: verifica si los campos requeridos tienen valor
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
    } // Cambiamos a JSON simple, lo que es mejor para estos datos.

    const citaData = {
      fecha: this.cita.fecha.split('T')[0], // Limpia el formato de fecha (si viene de ion-datetime)
      hora: this.cita.hora.split('T')[1]?.substring(0, 5) || this.cita.hora, // Limpia el formato de hora
      mascota_id: this.cita.mascota_id,
      servicios_id: this.cita.servicio_id,
      estado_id: this.cita.estado_id,
    };

    this.reservaService
      .subirCitas(citaData) // Envía el objeto JSON
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
          this.mostrarToast('Cita creada correctamente', 'success'); // Navegación más lógica tras crear la cita (cambiado de '/login')
          this.router.navigate(['/citas']); // Limpiar formulario

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
