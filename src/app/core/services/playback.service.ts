import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaybackService {
  playingEvent: EventEmitter<boolean> = new EventEmitter;
  constructor() { }

  setPlayback(playing: boolean) {
    this.playingEvent.emit(playing);
  }
}
