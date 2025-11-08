import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController } from '@ionic/angular';
import { Reserva } from '../services/reserva';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {
  constructor(
    private menuCtrl: MenuController,
    private reservaService: Reserva,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {}

  async logout() {
    const controller = await this.loadingCtrl.create({
      message: 'Cerrando sesión',
      spinner: 'crescent',
    });
    await controller.present();
    this.reservaService.logout().subscribe(
      (res) => {
        this.reservaService.limpiarSesionLocal();
        controller.dismiss();
        this.router.navigateByUrl('/login');
      },
      (error) => {
        this.reservaService.limpiarSesionLocal();
        controller.dismiss();
        console.error(
          'Error al cerrar sesión en el servidor, limpiando sesión local:',
          error
        );
        this.router.navigateByUrl('/login');
      }
    );
  }
}
