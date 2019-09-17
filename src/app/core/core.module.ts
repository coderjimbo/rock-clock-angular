import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputButtonsComponent } from './input-buttons/input-buttons.component';
import { AlbumComponent } from './album/album.component';
import { SongPlayerComponent } from './song-player/song-player.component';
import { LyricsDisplayComponent } from './lyrics-display/lyrics-display.component';
import { MinuteSecondsPipe } from './pipe/minute-seconds.pipe';
import { VideoPlayerComponent } from './video-player/video-player.component';



@NgModule({
  declarations: [InputButtonsComponent, AlbumComponent, SongPlayerComponent, LyricsDisplayComponent, MinuteSecondsPipe, VideoPlayerComponent],
  imports: [
    CommonModule
  ],
  exports: [
    InputButtonsComponent,
    AlbumComponent,
    SongPlayerComponent,
    LyricsDisplayComponent,
    VideoPlayerComponent,
    MinuteSecondsPipe
  ]
})
export class CoreModule { }
