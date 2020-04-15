import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { GpioWebsocketsService } from '../services/gpio-websockets.service';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}

@Component({
  selector: 'app-input-buttons',
  templateUrl: './input-buttons.component.html',
  styleUrls: ['./input-buttons.component.scss']
})
export class InputButtonsComponent implements OnInit {
  @Input() showButtons?: boolean = true;

  @Output() onStopButton: EventEmitter<boolean> = new EventEmitter();
  @Output() onPlayButton: EventEmitter<boolean> = new EventEmitter();
  @Output() onLeftButton: EventEmitter<boolean> = new EventEmitter();
  @Output() onRightButton: EventEmitter<boolean> = new EventEmitter();

  constructor(private socketsService: GpioWebsocketsService) { }

  ngOnInit() {
    this.socketsService.getSocketButtonOutput().subscribe(input => {
      switch(input.toLowerCase()) {
        case "left":
          this.pressLeftButton();
          break;
        case "right":
          this.pressRightButton();
          break;
        case "stop":
          this.pressStopButton();
          break;
        case "play":
          this.pressPlayButton();
          break;
        default:
        break;
      }
    });
  }

  pressStopButton() {
    this.onStopButton.emit(true);
  }

  pressPlayButton() {
    this.onPlayButton.emit(true);
  }

  pressLeftButton() {
    this.onLeftButton.emit(true);
  }

  pressRightButton() {
    this.onRightButton.emit(true);
  }

}
