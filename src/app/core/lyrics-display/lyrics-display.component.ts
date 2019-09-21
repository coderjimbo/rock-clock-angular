import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Lyric } from '../models/lyric';
import { Album } from '../models/album';

@Component({
  selector: 'app-lyrics-display',
  templateUrl: './lyrics-display.component.html',
  styleUrls: ['./lyrics-display.component.scss']
})
export class LyricsDisplayComponent implements OnInit, OnChanges {
  @Input() album: Album;
  @Input() trackIndex: number;
  @Input() currentTrackPosition?: number = 0;

  lyrics: Lyric[];
  hasLyrics: boolean = false;

  currentLyrics: Lyric[];
  currentLyricsIndex: number = 0;

  lastInsertedLyricIndex: number = 0;

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.trackIndex != null) {
      this.lyricsChanged();
    } else if(changes.currentTrackPosition != null) {
      this.trackPositionChanged();
    }
  }

  trackPositionChanged() {
    if(this.currentLyrics != null && this.currentLyrics.length > 0) {
      if(this.lyricOutOfRange(this.currentLyrics[this.currentLyricsIndex])) {

        if(this.currentLyrics.length >= 5 && (this.lastInsertedLyricIndex) <= this.lyrics.length - 2) {
          this.currentLyrics.shift();
        } else {
          if(this.currentLyricsIndex < this.currentLyrics.length - 1) {
            this.currentLyricsIndex++;
          }
        }
        if(this.lastInsertedLyricIndex <= this.lyrics.length - 2) {
          this.insertIntoCurrentLyricsFromLyricsArray(++this.lastInsertedLyricIndex);
        }
      }
    }
  }

  private lyricsChanged() {
    var data;
    this.hasLyrics = false;
    try {
      data = require('../../../assets/albums/' + this.album.rootPath + '/tracks/' + this.trackIndex + '.json');
      this.hasLyrics = true;
    }
    catch(e) {
      console.log("This track does not have lyrics JSON data associated with it")
    }
    if(this.hasLyrics) {
      this.lyrics = data.lyrics as Lyric[];

      this.currentLyrics = [];
      this.currentLyricsIndex = 0;
      if (this.lyrics.length >= 3) {
        for (let i = 0; i < 3; i++) {
          this.insertIntoCurrentLyricsFromLyricsArray(i);
        }
      }
      else {
        for (let i = 0; i < this.lyrics.length; i++) {
          this.insertIntoCurrentLyricsFromLyricsArray(i);
        }
      }
    }
  }

  private insertIntoCurrentLyricsFromLyricsArray(i: number) {
    this.currentLyrics.push(this.lyrics[i]);
    this.lastInsertedLyricIndex = i;
  }

  lyricOutOfRange(lyric: Lyric): boolean {
    return(lyric.startTime < this.currentTrackPosition && lyric.endTime < this.currentTrackPosition);
  }

  isCurrentLyric(lyric: Lyric) {
    return(lyric.startTime <= this.currentTrackPosition && lyric.endTime >= this.currentTrackPosition);
  }

}
