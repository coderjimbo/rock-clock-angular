import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
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
