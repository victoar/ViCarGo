import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserTripsPage } from './user-trips.page';

const routes: Routes = [
  {
    path: '',
    component: UserTripsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserTripsPageRoutingModule {}
