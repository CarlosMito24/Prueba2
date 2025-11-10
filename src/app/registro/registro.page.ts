import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage implements OnInit {
  apiUrl = 'http://127.0.0.1:8000/api/register';

  usuario = {
    nombres: '',
    apellidos: '',
    telefono: '',
    fecha_nacimiento: '',
    email: '',
    password: '',
  };

  constructor(
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {}

  async crearUsuario() {
    if (!this.usuario.nombres || !this.usuario.apellidos) {
      await this.mostrarToast(
        'Por favor, completa todos los campos requeridos.',
        'warning'
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nombres', this.usuario.nombres);
      formData.append('apellidos', this.usuario.apellidos);
      formData.append('telefono', this.usuario.telefono);
      formData.append('fecha_nacimiento', this.usuario.fecha_nacimiento);
      formData.append('email', this.usuario.email);
      formData.append('password', this.usuario.password);

      const response = await axios.post(this.apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      this.mostrarToast('Usuario creado correctamente', 'success');
      this.router.navigate(['/login']);

      this.usuario = {
        nombres: '',
        apellidos: '',
        telefono: '',
        fecha_nacimiento: '',
        email: '',
        password: '',
      };
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      const errorMessage =
        (error as any).response?.data?.message ||
        'Error de conexión o del servidor.';
      this.mostrarToast(`Fallo en el registro: ${errorMessage}`, 'danger');
    }
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