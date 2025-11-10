import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Reserva } from '../../app/services/reserva'; // Asegúrate que esta ruta sea correcta
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-actualizarperfil',
  templateUrl: './actualizarperfil.page.html',
  styleUrls: ['./actualizarperfil.page.scss'],
  standalone: false,
})
export class ActualizarperfilPage implements OnInit {
  usuario: any = {
    nombres: '',
    apellidos: '',
    telefono: '',
    fecha_nacimiento: '',
    email: '',
    password: '',
  };

  isLoading = true; // Controla el spinner de carga

  constructor(
    private toastCtrl: ToastController,
    private router: Router,
    private reservaService: Reserva,
    private loadingCtrl: LoadingController // Añadido para mostrar un indicador de carga
  ) {}

  ngOnInit() {
    this.obtenerDatos();
  }

  async obtenerDatos() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando perfil...',
    });
    await loading.present();

    this.reservaService
      .getUserProfile()
      .pipe(
        catchError((error) => {
          loading.dismiss();
          this.presentToast('Error al cargar los datos del usuario.', 'danger');
          console.error('Error al cargar el perfil:', error);
          this.isLoading = false;
          return of({ data: {} });
        })
      )
      .subscribe((response: any) => {
        if (response.data) {
          this.usuario = response.data;

          if (this.usuario.fecha_nacimiento) {
            this.usuario.fecha_nacimiento = new Date(
              this.usuario.fecha_nacimiento
            )
              .toISOString()
              .substring(0, 10);
          }
        }

        loading.dismiss();
        this.isLoading = false;
        console.log('Datos del usuario cargados correctamente:', this.usuario);
      });
  }

  async guardarDatos() {
    // Validación de minlength si el campo password NO está vacío
    if (this.usuario.password && this.usuario.password.length < 8) {
        this.presentToast('La contraseña debe tener al menos 8 caracteres.', 'warning');
        return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Actualizando perfil...',
    });
    await loading.present();

    let dataToSend: any = { ...this.usuario };

    if (!dataToSend.password) {
      delete dataToSend.password;
    }

    this.reservaService
      .updateUserProfile(dataToSend)
      .pipe(
        catchError((error) => {
          loading.dismiss();
          this.handleApiError(error);
          return of(null);
        })
      )
      .subscribe(async (response: any) => { // ⚠️ Nota: 'subscribe' debe ser 'async' si usas 'await' dentro
        if (response) {
          loading.dismiss();
          
          await this.presentToast( // Usar await para esperar que el Toast se muestre
            response.message || 'Perfil actualizado con éxito.',
            'success'
          );

          this.usuario.password = '';
          
          // 🚀 PASO CLAVE: Redirigir a la página de perfil
          // Cambia '/perfil' por la ruta real si es diferente (ej: '/tabs/perfil')
          this.router.navigate(['/perfil']); 
        }
      });
  }
  
  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      color: color,
    });
    toast.present();
  }

  handleApiError(error: any) {
    let errorMessage = 'Ocurrió un error desconocido.';
    let color = 'danger';

    if (error.status === 422 && error.error && error.error.errors) {
      const validationErrors = error.error.errors;
      const firstKey = Object.keys(validationErrors)[0];
      errorMessage = validationErrors[firstKey][0];
      color = 'warning';
    } else if (error.status === 401) {
      errorMessage = 'Sesión expirada o no autorizado.';
      this.router.navigate(['/perfil']);
    } else if (error.status === 0) {
      errorMessage = 'Error de conexión con el servidor.';
    }

    this.presentToast(errorMessage, color);
  }
}
