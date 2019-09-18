import { Component, OnInit } from '@angular/core';
import { Album } from 'src/app/core/models/album';
import { Track } from 'src/app/core/models/track';
import { Lyric } from 'src/app/core/models/lyric';
import { MediaPosition } from 'src/app/core/models/media-position';
import { Router, ActivatedRoute } from '@angular/router';
import { PlaybackService } from 'src/app/core/services/playback.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  currentAlbumIndex = "0";
  currentTrackIndex = 0;
  currentTrackPosition: number = 0;
  currentTrackDuration: number = 0;
  showLyrics: boolean = true;
  stopped: boolean = false;
  album: Album = new Album("Information Society", "Information Society");

  constructor(private router: Router, private route: ActivatedRoute, private playbackService: PlaybackService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.currentAlbumIndex = params.get("id");
    });

    this.album.rootPath = "album_9_infosoc";
    this.album.releaseDate = new Date("06/21/1988");
    
    let testTrack = new Track();
    testTrack.title = "What's On Your Mind (Pure Energy)";
    testTrack.audioLocation = "assets/albums/" + this.album.rootPath + "/tracks/0.mp3";
    testTrack.hasVideo = true;
    testTrack.videoLocation = "assets/albums/" + this.album.rootPath + "/videos/0.mp4";

    let testTrack1 = new Track();
    testTrack1.title = "Tomorrow";
    testTrack1.audioLocation = "assets/albums/" + this.album.rootPath + "/tracks/1.mp3";
    testTrack1.hasVideo = false;

    let lyric1 = new Lyric("It's worked so far but we're not out yet", 0, 3);
    let lyric2 = new Lyric("I want to know", 3, 5);
    let lyric3 = new Lyric("What you're thinking", 5, 7.5);
    let lyric4 = new Lyric("There are some things you can't hide", 7.5, 11);
    let lyric5 = new Lyric("I want to know", 11, 13);
    let lyric6 = new Lyric("What you're feeling", 13, 16);
    let lyric7 = new Lyric("Tell me what's on your mind", 16, 20);

    testTrack.lyrics.push(lyric1);
    testTrack.lyrics.push(lyric2);
    testTrack.lyrics.push(lyric3);
    testTrack.lyrics.push(lyric4);
    testTrack.lyrics.push(lyric5);
    testTrack.lyrics.push(lyric6);
    testTrack.lyrics.push(lyric7);

    this.album.tracks.push(testTrack);
    this.album.tracks.push(testTrack1);
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
    if(this.album.tracks.length - 1 > this.currentTrackIndex) {
      // Go to next track
      this.currentTrackIndex++;
    } else {
      this.goHome();
    }
  }

  goToPreviousTrack() {
    if(this.currentTrackIndex - 1 >= 0) {
      // Go to previous track
      this.currentTrackIndex--;
    }
  }

  goHome() {
    this.router.navigateByUrl("/home/" + this.currentAlbumIndex);
  }

  pressPlay() {
    if(this.stopped) {
      this.stopped = false;
      this.playbackService.setPlayback(true);
    } else {
      this.showLyrics = !this.showLyrics;
    }
  }

  pressStop() {
    if(this.stopped) {
      this.goHome()
    } else {
      this.stopped = true;
      this.playbackService.setPlayback(false);
    }
  }

  getWidthPercentage(): number {
    return (Math.round(this.currentTrackPosition) / Math.round(this.currentTrackDuration)) * 100;
  }

}
