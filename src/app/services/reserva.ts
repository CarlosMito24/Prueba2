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

  //Pasar Token a pagina login
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

  //Pasar Token para logout (perfil)
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

  //Obtener datos usuario
  getUserProfile(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    const url = this.path_server + 'user/profile';
    return this.http.get<any[]>(url, options);
  }

  updateUserProfile(userData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Incluir el token
      }),
    };
    const url = this.path_server + 'user/profile';

    // 💡 La clave es usar this.http.put() y enviar 'userData' en el cuerpo
    return this.http.put(url, userData, options);
  }

  //Mostrar servicios
  getServicios(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    const url = this.path_server + 'servicios';
    return this.http.get<any[]>(url, options);
  }

  //Mostrar mascotas
  getMascotas(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    const url = this.path_server + 'mascotas';
    return this.http.get<any[]>(url, options);
  }

  //Mostrar Citas Pendientes
  getCitasPendientes() {
    const token = localStorage.getItem('token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    const url = this.path_server + 'citas/pendientes';
    return this.http.get<any[]>(url, options);
  }

  //Mostrar Citas Completadas (Historial)
  getHistorialCitas() {
    const token = localStorage.getItem('token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    const url = this.path_server + 'citas/historial';
    return this.http.get<any[]>(url, options);
  }

  //Mostrar Mascotas para crear cita
  subirMascotas(mascotaData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const options = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };

    const url = this.path_server + 'mascotas';
    return this.http.post<any>(url, mascotaData, options);
  }

  //Crear Citas
  subirCitas(citaData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const options = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };

    const url = this.path_server + 'citas';
    return this.http.post<any>(url, citaData, options);
  }
}
