import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualizarperfilPage } from './actualizarperfil.page';

const routes: Routes = [
  {
    path: '',
    component: ActualizarperfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualizarperfilPageRoutingModule {}
