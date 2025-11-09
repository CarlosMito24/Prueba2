import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubirmascotasPage } from './subirmascotas.page';

const routes: Routes = [
  {
    path: '',
    component: SubirmascotasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubirmascotasPageRoutingModule {}
