import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { GpioRequest } from '../models/gpio-request';

@Injectable({
  providedIn: 'root'
})
export class GpioWebsocketsService {
  constructor(private socket: Socket) { }

  setLedPinValue(pin: number, value: number) {
    this.socket.emit("setOutput", new GpioRequest(pin, value));
  }

  setLedPinArrayValue(pins: number[], value: number) {
    let requests = [];
    pins.forEach(pin => {
      requests.push(new GpioRequest(pin, value));
    });
    this.socket.emit("setOutputArray", requests);
  }

  setLedPulsePinValueSpeed(pin: number, value: number, speed: number) {
    let request = new GpioRequest(pin, value);
    request.speed = speed;
    this.socket.emit("setPulse", request);
  }

  setLedPulsePinArrayValueSpeed(pins: number[], value: number, speed: number) {
    let requests = [];
    pins.forEach(pin => {
      let request = new GpioRequest(pin, value);
      request.speed = speed;
      requests.push(request);
    });
    this.socket.emit("setPulseArray", requests);
  }
}
