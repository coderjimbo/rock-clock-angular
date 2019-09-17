import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Album } from '../models/album';
import { Track } from '../models/track';
import { MediaPosition } from '../models/media-position';

@Component({
  selector: 'app-song-player',
  templateUrl: './song-player.component.html',
  styleUrls: ['./song-player.component.scss']
})
export class SongPlayerComponent implements OnInit, OnChanges {
  @ViewChild('audioOption', {static: true}) audioPlayerRef: ElementRef;
  
  @Input() album: Album;
  @Input() track: Track;
  @Output() trackPositionEvent: EventEmitter<MediaPosition> = new EventEmitter();
  mediaPosition = new MediaPosition();

  audio: HTMLAudioElement;

  songInterval: any;

  constructor() { }

  ngOnInit() {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.songInterval != null) {
      clearInterval(this.songInterval);
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    if(!this.track.hasVideo) {
      this.audio = new Audio();
      this.audio.src = this.track.audioLocation;
      this.audio.load();
      this.audio.play();
      //this.audio.playbackRate = 0.25;
      
      this.songInterval = setInterval(() => {
        this.mediaPosition.duration = this.audio.duration;
        this.mediaPosition.currentPosition = this.audio.currentTime;
        this.trackPositionEvent.emit(this.mediaPosition);
  
        if(this.audio.currentTime >= (this.audio.duration - 0.5)) {
          console.log("Done");
          this.trackPositionEvent.emit(null);
          clearInterval(this.songInterval);
        }
      }, 500);
    }
  }

}
