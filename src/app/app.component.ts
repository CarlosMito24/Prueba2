import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone : false,
})
export class AppComponent {
  showMenu = true; // visible por defecto

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const rutaActual = event.urlAfterRedirects;
        const ocultarEn = ['/login', '/registro'];
        this.showMenu = !ocultarEn.includes(rutaActual);
      });
  }
}