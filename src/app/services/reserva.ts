import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginResponse } from '../interfaces/loginResponse';
import { Observable } from 'rxjs'; // Necesario para el GET

@Injectable({
  providedIn: 'root',
})
export class Reserva {
  path_server: string = 'http://127.0.0.1:8000/api/';

  constructor(public http: HttpClient) {}

  login(email: string, password: string) {
    let datos = {
      email: email,
      password: password,
    };

    let options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    var url = this.path_server + 'login';
    return this.http.post<LoginResponse>(url, JSON.stringify(datos), options);
  }

  logout() {
    const token = localStorage.getItem('token');

    let options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    var url = this.path_server + 'logout';

    return this.http.post(url, {}, options);
  }

  limpiarSesionLocal() {
    localStorage.removeItem('token');
  }

  getServicios(): Observable<any[]> {
    const token = localStorage.getItem('token'); // <-- USAMOS 'api_token'

    // Si no hay token, la petición fallará con 401, pero Angular la enviará
    // a la API para que Laravel devuelva el error 401.

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // <-- ¡TOKEN INYECTADO!
      }),
    };

    const url = this.path_server + 'servicios';
    // Esperamos un array de servicios
    return this.http.get<any[]>(url, options);
  }
}
