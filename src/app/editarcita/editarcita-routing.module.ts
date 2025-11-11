import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarcitaPage } from './editarcita.page';

const routes: Routes = [
  {
    path: '',
    component: EditarcitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarcitaPageRoutingModule {}
