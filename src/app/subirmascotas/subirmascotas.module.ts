import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubirmascotasPageRoutingModule } from './subirmascotas-routing.module';

import { SubirmascotasPage } from './subirmascotas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubirmascotasPageRoutingModule
  ],
  declarations: [SubirmascotasPage]
})
export class SubirmascotasPageModule {}
