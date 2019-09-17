import { Time } from '@angular/common';

export class Lyric {
    line: string;
    startTime: number;
    endTime: number;

    constructor(line: string, startTime: number, endTime: number) {
        this.line = line;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}