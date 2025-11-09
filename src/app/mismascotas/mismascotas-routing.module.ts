import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MismascotasPage } from './mismascotas.page';

const routes: Routes = [
  {
    path: '',
    component: MismascotasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MismascotasPageRoutingModule {}
