import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MismascotasPageRoutingModule } from './mismascotas-routing.module';

import { MismascotasPage } from './mismascotas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MismascotasPageRoutingModule
  ],
  declarations: [MismascotasPage]
})
export class MismascotasPageModule {}
