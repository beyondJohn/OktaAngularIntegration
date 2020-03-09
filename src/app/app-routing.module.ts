import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OktaAuthService } from './okta-auth.service';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home', pathMatch: 'full'
    }, 
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [OktaAuthService]
    },
    {
        path: 'about',
        component: AboutComponent,
        canActivate: [OktaAuthService]
    },
    {
        path: '**',
        redirectTo: 'home', pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {

}