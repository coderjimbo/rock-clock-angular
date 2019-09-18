import { Component, OnInit, OnDestroy } from '@angular/core';
import { Album } from '../core/models/album';
import { Router, ActivatedRoute } from '@angular/router';
import { GpioWebsocketsService } from '../core/services/gpio-websockets.service';

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
    this.createAlbums();
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
    
    //this.gpioService.setLedPinAndValue(13, 10);
    //this.gpioService.setLedPulsePinArrayValueSpeed([13, 26], 32, 50);
  }

  selectAlbum(album: Album) {
    this.selectedAlbum = true;

    setTimeout(() => {
      this.goToAlbum();
    }, 600);
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

  private createAlbums() {
    let album_1: Album = new Album("Dark Side of the Moon", "Pink Floyd");
    album_1.rootPath = "album_1_dark_side";
    album_1.releaseDate = new Date("03/01/1973");
    let album_2: Album = new Album("Their Greatest Hits (1971-1975)", "The Eagles");
    album_2.rootPath = "album_2_eagles";
    album_2.releaseDate = new Date("02/17/1976");
    let album_3: Album = new Album("The Stranger", "Billy Joel");
    album_3.rootPath = "album_3_stranger";
    album_3.releaseDate = new Date("09/29/1977");
    let album_4: Album = new Album("Rio", "Duran Duran");
    album_4.rootPath = "album_4_rio";
    album_4.releaseDate = new Date("05/10/1982");
    let album_5: Album = new Album("Human's Lib", "Howard Jones");
    album_5.rootPath = "album_5_lib";
    album_5.releaseDate = new Date("03/05/1984");
    let album_6: Album = new Album("Songs from the Big Chair", "Tears for Fears");
    album_6.rootPath = "album_6_chair";
    album_6.releaseDate = new Date("02/25/1985");
    let album_7: Album = new Album("Dream Into Action", "Howard Jones");
    album_7.rootPath = "album_7_dream";
    album_7.releaseDate = new Date("03/11/1985");
    let album_8: Album = new Album("So Red the Rose", "Arcadia");
    album_8.rootPath = "album_8_rose";
    album_8.releaseDate = new Date("11/18/1985");
    let album_9: Album = new Album("Information Society", "Information Society");
    album_9.rootPath = "album_9_infosoc";
    album_9.releaseDate = new Date("06/21/1988");
    let album_10: Album = new Album("The Miracle", "Queen");
    album_10.rootPath = "album_10_miracle";
    album_10.releaseDate = new Date("05/22/1989");
    let album_11: Album = new Album("Innuendo", "Queen");
    album_11.rootPath = "album_11_innuendo";
    album_11.releaseDate = new Date("02/05/1991");
    let album_12: Album = new Album("The Division Bell", "Pink Floyd");
    album_12.rootPath = "album_12_division";
    album_12.releaseDate = new Date("03/28/1994");
    this.albums.push(album_1);
    this.albums.push(album_2);
    this.albums.push(album_3);
    this.albums.push(album_4);
    this.albums.push(album_5);
    this.albums.push(album_6);
    this.albums.push(album_7);
    this.albums.push(album_8);
    this.albums.push(album_9);
    this.albums.push(album_10);
    this.albums.push(album_11);
    this.albums.push(album_12);
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

}
