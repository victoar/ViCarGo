import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserCarsPage } from './user-cars.page';

const routes: Routes = [
  {
    path: '',
    component: UserCarsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserCarsPageRoutingModule {}
