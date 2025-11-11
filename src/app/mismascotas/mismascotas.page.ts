import { Component, OnInit } from '@angular/core';
import { Reserva } from '../../app/services/reserva';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastController, LoadingController } from '@ionic/angular'; // <-- Importamos LoadingController
import { Router } from '@angular/router';

@Component({
  selector: 'app-mismascotas',
  templateUrl: './mismascotas.page.html',
  styleUrls: ['./mismascotas.page.scss'],
  standalone: false,
})
export class MismascotasPage implements OnInit {
  mascotas: any[] = [];
  // 'isLoading' eliminado y reemplazado por LoadingController
  
  constructor(
    private reservaService: Reserva,
    private toastCtrl: ToastController,
    private router: Router,
    private loadingCtrl: LoadingController // <-- Inyectamos LoadingController
  ) {}

  ngOnInit() {
  }

  ionViewWillEnter() {
    // Este método se dispara CADA VEZ que el usuario navega a esta página
    this.cargarMascotas(); 
  }
  
  async cargarMascotas() { // Marcamos como async
    // 1. Mostrar el indicador de carga modal
    const loading = await this.loadingCtrl.create({
      message: 'Cargando tus mascotas...',
      spinner: 'crescent' // <-- CAMBIADO a 'crescent'
    });
    await loading.present();
    
    this.reservaService
      .getMascotas()
      .pipe(
        // 'finalize' se ejecuta tanto si hay éxito (next) como si hay error (catchError)
        finalize(async () => {
          await loading.dismiss(); // <-- 3. Ocultar LoadingController al terminar
        }),
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