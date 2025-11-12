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
    edad: null as unknown as number | null, // Inicialízalo como null o 0
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
      this.imagen && reader.readAsDataURL(this.imagen);
    }
  }

  crearMascota() {
    if (!this.mascota.nombre) {
      this.mostrarToast('El nombre de la mascota es obligatorio.', 'warning');
      return;
    }

    const formData = new FormData();

    formData.append('nombre', this.mascota.nombre);

    if (this.mascota.especie) {
      formData.append('especie', this.mascota.especie);
    }
    if (this.mascota.raza) {
      formData.append('raza', this.mascota.raza);
    }
    // Convertir a string antes de adjuntar, y asegurar que se adjunte
    if (
      this.mascota.edad !== null &&
      this.mascota.edad !== undefined &&
      String(this.mascota.edad) !== ''
    ) {
      formData.append('edad', String(this.mascota.edad));
    }

    if (this.imagen) {
      formData.append('imagen', this.imagen);
    }
    this.reservaService
      .subirMascotas(formData)
      .pipe(
        catchError((error) => {
          let errorMessage = 'Error de conexión o al procesar la solicitud.';

          if (error.error?.errors) {
            const firstErrorKey = Object.keys(error.error.errors)[0];
            errorMessage = error.error.errors[firstErrorKey][0];
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 401) {
            errorMessage =
              'Error de autenticación. Por favor, inicia sesión de nuevo.';
          }

          this.mostrarToast(`Fallo en el registro: ${errorMessage}`, 'danger');
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          this.mostrarToast('Mascota creada correctamente', 'success');
          this.router.navigate(['/mismascotas']);

          this.imagen = null;
          this.imagenPreview = null;
          this.mascota = {
            nombre: '',
            especie: '',
            raza: '',
            edad: null,
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
