import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges, OnDestroy, HostListener } from '@angular/core';
import { Track } from '../models/track';
import { MediaPosition } from '../models/media-position';
import { PlaybackService } from '../services/playback.service';
import { Album } from '../models/album';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() track: Track;
  @Input() album: Album;
  @Input() trackIndex: number;
  @Input() hidden: boolean = false;
  @Output() videoPositionEvent: EventEmitter<MediaPosition> = new EventEmitter();
  mediaPosition = new MediaPosition();

  @ViewChild('videoPlayer', {static: false}) videoplayer: ElementRef;
  video: HTMLVideoElement;
  videoInterval: any;
  paused: boolean = false;

  constructor(private playbackService: PlaybackService) { }

  @HostListener('window:onVideoPlayerReady', ['$event.detail'])
  onVideoReady(detail) {
    console.log('video', detail);
    if(this.track.hasVideo) {
      this.playVideo();
    } else {
      clearInterval(this.videoInterval);
    }
  }

  ngOnDestroy(): void {
    this.video.pause();
    this.video.currentTime = 0;
    this.video.load();
    clearInterval(this.videoInterval);
  }

  ngOnInit() {
    this.playbackService.playingEvent.subscribe(event => {
      if(this.track.hasVideo) {
        this.controlVideo(event);
      }
    });
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
      let path = "assets/albums/" + this.album.rootPath + "/tracks/" + this.trackIndex + ".mp4";
      this.video.src = path;
      this.controlVideo(true);
    }
  }

  controlVideo(nowPlaying: boolean) {
    if(nowPlaying == null) {
      this.video.src = null;
    }
    if(nowPlaying) {
      this.video.oncanplay = function(ev) {
        var event = new CustomEvent('onVideoPlayerReady', {
          detail: {
              trackReady: ev.returnValue,
              trackElement: ev.srcElement
          }
        });
        window.dispatchEvent(event);
      };
      if(this.paused) {
        this.paused = false;
        clearInterval(this.videoInterval);
        this.playVideo();
      }

    } else {
      this.video.pause();
      this.paused = true;
      clearInterval(this.videoInterval);
    }
  }
  

  private playVideo() {
    this.video.play();
    this.mediaPosition = new MediaPosition();
    clearInterval(this.videoInterval);
    this.videoInterval = setInterval(() => {
      this.mediaPosition.duration = this.video.duration;
      this.mediaPosition.currentPosition = this.video.currentTime;
      this.videoPositionEvent.emit(this.mediaPosition);
      if (this.video.currentTime >= (this.video.duration - 1.0)) {
        this.videoPositionEvent.emit(null);
        this.endVideo();
      }
    }, 500);
  }

  endVideo() {
    this.video.pause();
    this.video.currentTime = 0;
    clearInterval(this.videoInterval);
  }
}
