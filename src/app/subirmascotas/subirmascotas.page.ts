import { Component, OnInit } from '@angular/core';
import { Reserva } from '../../app/services/reserva';
import { catchError, finalize } from 'rxjs/operators';
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

  imagen: File | null = null;
  imagenPreview: string | null = null;

  constructor(
    private reservaService: Reserva,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {}

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.imagen = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = e.target.result;
      };
      // Uso seguro: solo lee si this.imagen no es null
      this.imagen && reader.readAsDataURL(this.imagen);
    }
  }

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
    formData.append('especie', this.mascota.especie);
    formData.append('raza', this.mascota.raza);
    formData.append('edad', this.mascota.edad);
    if (this.imagen) {
      formData.append('imagen', this.imagen);
    }

    this.reservaService
      .subirMascotas(formData)
      .pipe(
        catchError((error) => {
          console.error('Error al registrar la mascota:', error);

          let errorMessage = 'Error de conexión o al procesar la solicitud.';

          // CRUCIAL: 1. Intentar capturar errores de validación de Laravel (código 422)
          if (error.error?.errors) {
            const firstErrorKey = Object.keys(error.error.errors)[0];
            errorMessage = error.error.errors[firstErrorKey][0];
          }
          // 2. Capturar el mensaje general (ej: error 401, 500)
          else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 401) {
            errorMessage =
              'Error de autenticación. Por favor, inicia sesión de nuevo.';
          }

          this.mostrarToast(`Fallo en el registro: ${errorMessage}`, 'danger');
          return of(null); // Retorna un Observable nulo para detener la secuencia
        })
      )
      .subscribe((response) => {
        if (response) {
          this.mostrarToast('Mascota creada correctamente', 'success');
          this.router.navigate(['/mismascotas']);

          // Resetear el estado de la aplicación
          this.imagen = null;
          this.imagenPreview = null;
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
