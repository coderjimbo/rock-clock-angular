import { Track } from './track';

export class Album {
    title: string;
    artist: string;
    releaseDate: Date;
    rootPath: string;
    tracks: Track[] = [];

    constructor(title: string, artist: string) {
        this.title = title;
        this.artist = artist;
    }
}