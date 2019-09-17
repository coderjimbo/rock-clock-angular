import { Time } from '@angular/common';
import { Lyric } from './lyric';

export class Track {
    title: string;
    hasVideo: boolean = false;
    audioLocation: string;
    videoLocation: string;
    lyrics: Lyric[] = [];
}