import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallbackComponent} from './callback/callback.component';

import { OktaAuthService} from './okta-auth.service';
import { HomeComponent } from './home/home.component';

const routes: Routes = [{
  path: '',
  component: CallbackComponent,
  canActivate: [OktaAuthService]
}, {
  path: 'home',
  component: HomeComponent,
  canActivate: [OktaAuthService]
},
  {
    path: '**',
    redirectTo: '/home', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}