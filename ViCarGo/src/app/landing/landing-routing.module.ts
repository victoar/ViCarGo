import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingPage } from './landing.page';

const routes: Routes = [
  {
    path: '',
    component: LandingPage,
    children: [{
      path: '',
      pathMatch: 'full',
      redirectTo: '/landing/home',
      },
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then((m) => m.HomePageModule)
      },
      {
        path: 'account',
        loadChildren: () => import('../my-account/my-account.module').then((m) => m.MyAccountPageModule)
      },
      {
        path: 'favorites',
        loadChildren: () => import('../favorites/favorites.module').then((m) => m.FavoritesPageModule)
      },
      {
        path: 'chats',
        loadChildren: () => import('../chats/chats.module').then((m) => m.ChatsPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingPageRoutingModule {}
