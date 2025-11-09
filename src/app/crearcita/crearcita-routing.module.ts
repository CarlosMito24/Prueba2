import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearcitaPage } from './crearcita.page';

const routes: Routes = [
  {
    path: '',
    component: CrearcitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearcitaPageRoutingModule {}
