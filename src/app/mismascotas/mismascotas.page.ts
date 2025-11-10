import { Component, OnInit } from '@angular/core';
import { Reserva } from '../../app/services/reserva';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastController } from '@ionic/angular';
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
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarMascotas();
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
        console.log('Mascotas cargadas correctamente:', this.mascotas);
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
