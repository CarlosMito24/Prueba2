import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import { Reserva } from '../services/reserva';
import { finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-editarcita',
  templateUrl: './editarcita.page.html',
  styleUrls: ['./editarcita.page.scss'],
  standalone: false,
})
export class EditarcitaPage implements OnInit {
  citaId: number = 0;
  formularioCita: FormGroup;

  mascotas: any[] = [];
  servicios: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private reservaService: Reserva,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    this.formularioCita = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      mascota_id: ['', Validators.required],
      servicios_id: ['', Validators.required],
      estado_id: [1, Validators.required],
    });
  }

  ngOnInit() {
    this.citaId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDatosIniciales();
  }

  async cargarDatosIniciales() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando datos de la cita...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      const mascotasPromise = this.reservaService.getMascotas().toPromise();
      const serviciosPromise = this.reservaService.getServicios().toPromise();

      const [mascotasData, serviciosData] = await Promise.all([
        mascotasPromise,
        serviciosPromise,
      ]);
      this.mascotas = mascotasData || [];
      this.servicios = serviciosData || [];

      if (this.citaId) {
        const cita = await this.reservaService
          .getCitaPorId(this.citaId)
          .toPromise();

        if (cita) {
          this.formularioCita.patchValue({
            fecha: cita.fecha,
            hora: cita.hora,
            mascota_id: cita.mascota_id,
            servicios_id: cita.servicios_id,
            estado_id: cita.estado_id,
          });
        } else {
          throw new Error('Cita no encontrada.');
        }
      }
    } catch (err) {
      this.mostrarMensaje(
        'No se pudieron cargar los datos de la cita. Vuelva a intentar.',
        'danger'
      );
      this.router.navigate(['/home']);
    } finally {
      loading.dismiss();
    }
  }

  async guardarCambios() {
    if (this.formularioCita.invalid) {
      this.mostrarMensaje(
        'Por favor, revisa todos los campos requeridos.',
        'warning'
      );
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Guardando cambios...',
      spinner: 'crescent',
    });
    await loading.present();

    const datosActualizados = this.formularioCita.value;

    this.reservaService
      .editarCita(this.citaId, datosActualizados)
      .pipe(
        finalize(async () => {
          await loading.dismiss();
        })
      )
      .subscribe({
        next: (res) => {
          this.mostrarMensaje(
            res.message || 'Cita actualizada con éxito.',
            'success'
          );
          this.router.navigate(['/']);
        },
        error: (err) => {
          let errorMessage =
            'Error al actualizar la cita. Por favor, revisa la consola.';
          if (err.error?.message) {
            errorMessage = err.error.message;
          }
          this.mostrarMensaje(errorMessage, 'danger');
        },
      });
  }

  async mostrarMensaje(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: color,
    });
    toast.present();
  }
}
