import { Component, OnInit } from '@angular/core';
import { Reserva } from '../../app/services/reserva';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subirmascotas',
  templateUrl: './subirmascotas.page.html',
  styleUrls: ['./subirmascotas.page.scss'],
  standalone: false,
})
export class SubirmascotasPage implements OnInit {
  apiUrl = 'http://127.0.0.1:8000/api/mascotas';

  mascota = {
    nombre: '',
    especie: '',
    raza: '',
    edad: '',
  };

  constructor(
    private reservaService: Reserva,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {}
  crearMascota() {
    if (
      !this.mascota.nombre ||
      !this.mascota.especie ||
      !this.mascota.raza ||
      !this.mascota.edad
    ) {
      this.mostrarToast(
        'Por favor, completa todos los campos requeridos.',
        'warning'
      );
      return;
    }

    const formData = new FormData();

    formData.append('nombre', this.mascota.nombre);
    formData.append('especie', this.mascota.especie); // Mapeo de especie a 'apellidos'
    formData.append('raza', this.mascota.raza); // Mapeo de raza a 'telefono'
    formData.append('edad', this.mascota.edad);

    this.reservaService
      .subirMascotas(formData)
      .pipe(
        catchError((error) => {
          console.error('Error al registrar la mascota:', error);
          const errorMessage =
            error.error?.message ||
            (error.status === 401
              ? 'Error de autenticación. Por favor, inicia sesión de nuevo.'
              : 'Error de conexión o del servidor.');
          this.mostrarToast(`Fallo en el registro: ${errorMessage}`, 'danger');
          return of(null); // Retorna un Observable nulo para evitar que la app falle
        })
      )
      .subscribe((response) => {
        if (response) {
          this.mostrarToast('Mascota creada correctamente', 'success');
          this.router.navigate(['/login']); // Navega después del éxito

          // Limpiar formulario
          this.mascota = {
            nombre: '',
            especie: '',
            raza: '',
            edad: '',
          };
        }
      });
  }
  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      color,
    });
    toast.present();
  }
}
