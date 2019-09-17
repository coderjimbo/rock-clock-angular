import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Track } from '../models/track';
import { MediaPosition } from '../models/media-position';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() track: Track;
  @Input() hidden: boolean = false;
  @Output() videoPositionEvent: EventEmitter<MediaPosition> = new EventEmitter();
  mediaPosition = new MediaPosition();

  @ViewChild('videoPlayer', {static: false}) videoplayer: ElementRef;
  video: HTMLVideoElement;
  videoInterval: any;

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.video = this.videoplayer.nativeElement;
    this.handleChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.track != null && !changes.track.isFirstChange()) {
      this.handleChanges();
    }
  }

  handleChanges() {
    if(this.videoInterval != null) {
      this.endVideo();
    }
    
    if(this.track.hasVideo) {
      this.video.src = this.track.videoLocation;
      this.video.play();
      this.mediaPosition = new MediaPosition();
      this.videoInterval = setInterval(() => {
        this.mediaPosition.duration = this.video.duration;
        this.mediaPosition.currentPosition = this.video.currentTime;
        this.videoPositionEvent.emit(this.mediaPosition);
        if(this.video.currentTime >= (this.video.duration - 1.0)) {
          console.log("done");
          this.videoPositionEvent.emit(null);
          this.endVideo();
        }
      }, 500);
    }
  }

  endVideo() {
    this.video.pause();
    this.video.currentTime = 0;
    clearInterval(this.videoInterval);
  }
}
