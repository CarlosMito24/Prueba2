import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoIngresadoGuard } from './no-ingresado-guard';
import { IngresadoGuard } from './ingresado-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
    canActivate: [NoIngresadoGuard],
  },
  {
    path: 'registro',
    loadChildren: () =>
      import('./registro/registro.module').then((m) => m.RegistroPageModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    canActivate: [IngresadoGuard],
  },
  {
    path: 'citas',
    loadChildren: () =>
      import('./citas/citas.module').then((m) => m.CitasPageModule),
    canActivate: [IngresadoGuard],
  },
  {
    path: 'perfil',
    loadChildren: () =>
      import('./perfil/perfil.module').then((m) => m.PerfilPageModule),
    canActivate: [IngresadoGuard],
  },
  {
    path: 'subirmascotas',
    loadChildren: () =>
      import('./subirmascotas/subirmascotas.module').then(
        (m) => m.SubirmascotasPageModule
      ),
    canActivate: [IngresadoGuard],
  },
  {
    path: 'crearcita',
    loadChildren: () =>
      import('./crearcita/crearcita.module').then((m) => m.CrearcitaPageModule),
    canActivate: [IngresadoGuard],
  },
  {
    path: 'mismascotas',
    loadChildren: () =>
      import('./mismascotas/mismascotas.module').then(
        (m) => m.MismascotasPageModule
      ),
    canActivate: [IngresadoGuard],
  },
  {
    path: 'actualizarperfil',
    loadChildren: () => import('./actualizarperfil/actualizarperfil.module').then( m => m.ActualizarperfilPageModule)
  },
  {
    path: 'editarcita/:id',
    loadChildren: () => import('./editarcita/editarcita.module').then( m => m.EditarcitaPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
