import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { HomeComponent } from './home/home.component';
import { PlayerComponent } from './playback/player/player.component';


const routes: Routes = [
  {path: '', redirectTo: '/welcome', pathMatch: 'full'},
  {path: 'welcome', component: WelcomeScreenComponent, data: {animation: 'Welcome'}},
  {path: 'home/:id', component: HomeComponent, data: {animation: 'Home'}},
  {path: 'play/:id', component: PlayerComponent, data: {animation: 'Play'}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
