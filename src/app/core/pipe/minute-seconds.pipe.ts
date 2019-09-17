import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteSeconds'
})
export class MinuteSecondsPipe implements PipeTransform {

  transform(value: number): string {
    let minVal: number = Math.round(value);
    const minutes: number = Math.floor(minVal / 60);
    return minutes.toString().padStart(2, '0') + ':' + 
        (minVal - minutes * 60).toString().padStart(2, '0');
 }

}
