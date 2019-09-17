import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { PlaybackModule } from './playback/playback.module';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    HomeModule,
    PlaybackModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
