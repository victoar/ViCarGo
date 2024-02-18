import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserCarRequestsPage } from './user-car-requests.page';

const routes: Routes = [
  {
    path: '',
    component: UserCarRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserCarRequestsPageRoutingModule {}
