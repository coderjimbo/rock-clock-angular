import { Component, OnInit } from '@angular/core';
import { Album } from 'src/app/core/models/album';
import { Track } from 'src/app/core/models/track';
import { Lyric } from 'src/app/core/models/lyric';
import { MediaPosition } from 'src/app/core/models/media-position';
import { Router, ActivatedRoute } from '@angular/router';
import { PlaybackService } from 'src/app/core/services/playback.service';
import Vibrant from 'node-vibrant'
import { Palette } from 'node-vibrant/lib/color';
import AlbumJson from '../../../assets/albums/albums.json';
import { LEDPinValues, LEDPinBrightnessValues } from 'src/app/core/led-pin-values';
import { GpioWebsocketsService } from 'src/app/core/services/gpio-websockets.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  currentAlbumIndex = "0";
  currentAlbumIndexNumber = -1;
  currentTrackIndex = 0;
  currentTrackPosition: number = 0;
  currentTrackDuration: number = 0;
  showLyrics: boolean = false;
  stopped: boolean = false;
  album: Album;
  tracks: Track[];
  resultPalette: Palette;


  constructor(private router: Router, private route: ActivatedRoute, private playbackService: PlaybackService, private gpioService: GpioWebsocketsService) { }

  ngOnInit() {
    let albums = AlbumJson.albums as Album[];
    
    this.route.paramMap.subscribe(params => {
      this.currentAlbumIndex = params.get("id");
      this.currentAlbumIndexNumber = parseInt(this.currentAlbumIndex);
      this.album = albums[this.currentAlbumIndexNumber];

      var data = require('../../../assets/albums/' + this.album.rootPath + '/tracks/tracks.json');
      this.tracks = data.tracks as Track[];
    });

    Vibrant.from('assets/albums/' + this.album.rootPath + '/artwork/artwork.png').getPalette((err, palette) => {
      this.resultPalette = palette;
    });
    this.setButtonLEDs();
  }

  getMutedBackgroundColor(): string {
    if(this.resultPalette != null && this.resultPalette.DarkMuted != null) {
      return this.resultPalette.DarkMuted.getHex()
    }
  }

  updateCurrentTrackPosition(event: MediaPosition) {
    if(event != null) {
      this.currentTrackPosition = event.currentPosition;
      this.currentTrackDuration = event.duration;
    } else {
      this.currentTrackDuration = 0;
      this.currentTrackPosition = 0;
      this.goToNextTrack();
    }
  }

  goToNextTrack() {
    if(this.tracks.length - 1 > this.currentTrackIndex) {
      // Go to next track
      this.currentTrackIndex++;
      this.stopped = false;
      this.setButtonLEDs();
    } else {
      this.playbackService.setPlayback(null);
      this.goHome();
    }
  }

  goToPreviousTrack() {
    if(this.currentTrackIndex - 1 >= 0) {
      // Go to previous track
      this.currentTrackIndex--;
      this.setButtonLEDs();
    }
  }

  goHome() {
    this.router.navigateByUrl("/home/" + this.currentAlbumIndex);
  }

  pressPlay() {
    if(this.stopped) {
      this.stopped = false;
      this.playbackService.setPlayback(true);
      this.setButtonLEDs();
    } 
    // else {
    //   this.showLyrics = !this.showLyrics;
    // } //TODO: Implement lyrics functionality
  }

  pressStop() {
    if(this.stopped) {
      this.goHome()
    } else {
      this.stopped = true;
      this.playbackService.setPlayback(false);
      this.setButtonLEDs();
    }
  }

  getWidthPercentage(): number {
    return (Math.round(this.currentTrackPosition) / Math.round(this.currentTrackDuration)) * 100;
  }

  currentTrackHasLyrics(): boolean {
    return false; //TODO: Implement lyrics functionality
  }

  setButtonLEDs() {
    this.gpioService.clearAllLeds(true);
    let buttonPinsToLight: number[] = [];
    if(!this.stopped) {
      buttonPinsToLight.push(LEDPinValues.PLAY);
    }

    if(this.currentTrackIndex != 0) {
      buttonPinsToLight.push(LEDPinValues.LEFT);
    }
    buttonPinsToLight.push(LEDPinValues.RIGHT);
    buttonPinsToLight.push(LEDPinValues.STOP);

    this.gpioService.setLedPinArrayValue(buttonPinsToLight, LEDPinBrightnessValues.ON_BUTTONS_MAX, true);
  }

}
