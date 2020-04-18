import { Component, OnInit, OnDestroy } from '@angular/core';
import { Album } from '../core/models/album';
import { Router, ActivatedRoute } from '@angular/router';
import { GpioWebsocketsService } from '../core/services/gpio-websockets.service';
import AlbumJson from '../../assets/albums/albums.json';
import { LEDPinValues } from '../core/led-pin-values'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    clearInterval(this.inter);
  }
  albums: Album[] = [];
  visibleAlbumIndices: number[] = [];
  selectedIndex = 0;
  movingLeft: boolean = false;
  movingRight: boolean = false;
  midpoint: number;
  selectedAlbum: boolean = false;
  inter: any;

  constructor(private router: Router, private route: ActivatedRoute, private gpioService: GpioWebsocketsService) { }

  ngOnInit() {
    this.albums = AlbumJson.albums as Album[];
    this.route.paramMap.subscribe(params => {
      this.visibleAlbumIndices = [];
      let midPoint = parseInt(params.get("id"));
      this.visibleAlbumIndices.push(this.getAlbumIndex(midPoint, -3));
      this.visibleAlbumIndices.push(this.getAlbumIndex(midPoint, -2));
      this.visibleAlbumIndices.push(this.getAlbumIndex(midPoint, -1));
      this.visibleAlbumIndices.push(midPoint);
      this.visibleAlbumIndices.push(this.getAlbumIndex(midPoint, 1));
      this.visibleAlbumIndices.push(this.getAlbumIndex(midPoint, 2));
      this.visibleAlbumIndices.push(this.getAlbumIndex(midPoint, 3));
      this.midpoint = Math.floor(this.visibleAlbumIndices.length / 2);
    });
    
    this.setAlbumLed();
    this.setButtonLEDs();
    //this.gpioService.setLedPulsePinArrayValueSpeed([13], 32, 50);
  }

  selectAlbum(album: Album) {
    this.selectedAlbum = true;

    setTimeout(() => {
      this.goToAlbum();
    }, 600);
  }

  setAlbumLed() {
    this.gpioService.clearAllLeds(false);
    this.gpioService.setLedPinValue(this.getPinIndex(this.getSelectedAlbumIndex()), 192);
  }

  setButtonLEDs() {
    let buttonPinsToLight: number[] = [];
    buttonPinsToLight.push(LEDPinValues.PLAY);
    buttonPinsToLight.push(LEDPinValues.STOP);
    buttonPinsToLight.push(LEDPinValues.LEFT);
    buttonPinsToLight.push(LEDPinValues.RIGHT);

    this.gpioService.setLedPinArrayValue(buttonPinsToLight, 255, true);
  }

  getSelectedAlbumIndex(): number {
    return this.visibleAlbumIndices[this.midpoint];
  }

  getAlbumIndex(index: number, distance: number): number {
    let numberToReturn: number = -999;
    if(index + distance >= 0 && index + distance <= this.albums.length - 1) {
      numberToReturn = index + distance;
    } else {
      numberToReturn = this.mod((index + distance), (this.albums.length));
    }
    return numberToReturn;
  }

  mod(n, m) {
    return ((n % m) + m) % m;
  }

  move(left: boolean) {
    if(!this.movingLeft && !this.movingRight && !this.selectedAlbum) {
      if(left) {
        this.movingLeft = true;
        this.midpoint += 1;
      } else {
        this.movingRight = true;
        this.midpoint -=1;
      }
      this.setAlbumLed();
      setTimeout(() => {
        if(left) {
          // Right button clicked
          this.visibleAlbumIndices.push(this.getAlbumIndex(this.visibleAlbumIndices[this.visibleAlbumIndices.length - 1], 1));
          this.visibleAlbumIndices.shift();
          this.movingLeft = false;
          this.midpoint -= 1;
        } else {
          this.visibleAlbumIndices.unshift(this.getAlbumIndex(this.visibleAlbumIndices[0], -1));
          this.visibleAlbumIndices.pop();
          this.movingRight = false;
          this.midpoint += 1;
        }
        
      }, 450);
    }
  }

  incrementSelectedIndex() {
    if((this.selectedIndex + 1) > this.albums.length - 1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex += 1;
    }
  }

  decrementSelectedIndex() {
    if((this.selectedIndex - 1) < 0) {
      this.selectedIndex = this.albums.length - 1;
    } else {
      this.selectedIndex -= 1;
    }
  }

  goToAlbum() {
    let album = this.albums[this.getSelectedAlbumIndex()];
    this.router.navigateByUrl("/play/" + this.getSelectedAlbumIndex(), {state: album});
  }

  goToWelcome() {
    this.router.navigateByUrl("/welcome");
  }

  getPinIndex(albumIndex: number): number {
    switch(albumIndex) {
      case 0:
        return LEDPinValues.TWELVE;
      case 1:
        return LEDPinValues.ONE;
      case 2:
        return LEDPinValues.TWO;
      case 3:
        return LEDPinValues.THREE;
      case 4:
        return LEDPinValues.FOUR;
      case 5:
        return LEDPinValues.FIVE;
      case 6:
        return LEDPinValues.SIX;
      case 7:
        return LEDPinValues.SEVEN;
      case 8:
        return LEDPinValues.EIGHT;
      case 9:
        return LEDPinValues.NINE;
      case 10:
        return LEDPinValues.TEN;
      case 11:
        return LEDPinValues.ELEVEN;
      default:
        return -1;
    }
  }

}
