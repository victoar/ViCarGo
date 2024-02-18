import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyAccountPage } from './my-account.page';

const routes: Routes = [
  {
    path: '',
    component: MyAccountPage
  },
  {
    path: 'user-details',
    loadChildren: () => import('./user-details/user-details.module').then( m => m.UserDetailsPageModule)
  },
  {
    path: 'user-cars',
    loadChildren: () => import('./user-cars/user-cars.module').then( m => m.UserCarsPageModule)
  },
  {
    path: 'user-trips',
    loadChildren: () => import('./user-trips/user-trips.module').then( m => m.UserTripsPageModule)
  },
  {
    path: 'user-car-requests',
    loadChildren: () => import('./user-car-requests/user-car-requests.module').then( m => m.UserCarRequestsPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyAccountPageRoutingModule {}
