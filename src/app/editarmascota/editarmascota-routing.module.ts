import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarmascotaPage } from './editarmascota.page';

const routes: Routes = [
  {
    path: '',
    component: EditarmascotaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarmascotaPageRoutingModule {}
