import { Component, OnInit } from '@angular/core';
import { Reserva } from '../../app/services/reserva'; // Asegúrate de que esta ruta sea correcta
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  // Aquí se guardarán los datos para ser usados en el HTML (*ngFor)
  servicios: any[] = []; 
  
  // 1. Inyección de dependencia: Declara una variable privada para el servicio
  constructor(private reservaService: Reserva) {}

  ngOnInit() {
    this.cargarServicios();
  }

  cargarServicios() {
    // 2. Llama al método del servicio
    this.reservaService.getServicios()
      .pipe(
        // Manejo de errores (si el token falla, obtendrás aquí el error 401)
        catchError(error => {
          console.error('Error al cargar servicios. ¿Token expirado o error CORS?', error);
          this.servicios = []; 
          return of([]); 
        })
      )
      // 3. Suscripción: Cuando la API responde con éxito, asigna los datos a la variable
      .subscribe((data: any[]) => {
        // data contiene la respuesta de tu API (/api/servicios)
        this.servicios = data; 
        console.log('Servicios cargados correctamente:', this.servicios);
      });
  }
}