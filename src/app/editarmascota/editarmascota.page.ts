import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NavController,
  AlertController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { Reserva } from 'src/app/services/reserva';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-editarmascota',
  templateUrl: './editarmascota.page.html',
  styleUrls: ['./editarmascota.page.scss'],
  standalone: false,
})
export class EditarmascotaPage implements OnInit {
  mascotaId!: number;
  mascotaForm!: FormGroup;
  mascotaActual: any = null;
  imagenSeleccionada: File | null = null;
  imagenURLActual: string | null = null;
  imagenPrevisualizacionUrl: string | ArrayBuffer | null = null;
  servidorUrl: string = 'http://127.0.0.1:8000/images/';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private reservaService: Reserva,
    private navCtrl: NavController,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.mascotaId = +id;
        this.cargarMascota(this.mascotaId);
      } else {
        this.presentToast('No se encontró el ID de la mascota.', 'danger');
        this.navCtrl.back();
      }
    });
  }

  initForm() {
    this.mascotaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(255)]],
      especie: [''],
      raza: [''],
      edad: [
        null as unknown as number | null,
        [Validators.min(0), Validators.max(30)],
      ],
      imagen: [null],
    });
  }

  async cargarMascota(id: number) {
    const loading = await this.loadingController.create({
      message: 'Cargando datos de la mascota...',
      spinner: 'crescent', // Usamos un spinner visualmente atractivo
      cssClass: 'custom-loading' // Usa la clase CSS global que definiste antes
    });
    await loading.present();

    this.reservaService.getMascotaPorId(id)
      .pipe(
        finalize(() => {
          // Oculta el loading cuando la petición termina (éxito o error)
          loading.dismiss(); 
        })
      )
      .subscribe({
        next: (data) => {
          this.mascotaActual = data;
          this.imagenURLActual = this.servidorUrl + data.imagen;
          this.mascotaForm.patchValue({
            nombre: data.nombre,
            especie: data.especie,
            raza: data.raza,
            edad: data.edad,
          });
        },
        error: (error) => {
          this.presentToast('Error al cargar los datos de la mascota.', 'danger');
          this.navCtrl.back();
        },
      });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
      this.mascotaForm.get('imagen')?.setValue(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPrevisualizacionUrl = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.imagenSeleccionada = null;
      this.mascotaForm.get('imagen')?.setValue(null);
      this.imagenPrevisualizacionUrl = null;
    }
  }

  clearNewImageSelection() {
    this.imagenSeleccionada = null;
    this.imagenPrevisualizacionUrl = null;
    this.mascotaForm.get('imagen')?.setValue(null);
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit() {
    if (this.mascotaForm.invalid) {
      this.presentToast(
        'Por favor, completa el formulario correctamente.',
        'warning'
      );
      return;
    }

    const formData = new FormData();
    formData.append('_method', 'PUT');
    Object.keys(this.mascotaForm.controls).forEach((key) => {
      if (key !== 'imagen') {
        const value = this.mascotaForm.get(key)?.value;
        const finalValue = value === null || value === undefined ? '' : value;
        formData.append(key, String(finalValue));
      }
    });

    if (this.imagenSeleccionada) {
      formData.append(
        'imagen',
        this.imagenSeleccionada,
        this.imagenSeleccionada.name
      );
    }

    this.reservaService.editarMascota(this.mascotaId, formData).subscribe({
      next: (res) => {
        this.presentToast(
          res.message || 'Mascota actualizada con éxito.',
          'success'
        );
        this.navCtrl.navigateRoot('/mismascotas');
      },
      error: (err) => {
        let errorMessage =
          'Error al actualizar la mascota. Verifica los datos.';
        if (err.error?.message) {
          errorMessage = err.error.message;
        }
        this.presentToast(errorMessage, 'danger');
      },
    });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color,
    });
    toast.present();
  }

  goBack() {
    this.navCtrl.back();
  }
}
