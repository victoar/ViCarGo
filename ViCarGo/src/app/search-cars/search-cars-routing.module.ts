import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchCarsPage } from './search-cars.page';

const routes: Routes = [
  {
    path: '',
    component: SearchCarsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchCarsPageRoutingModule {}
