export class GpioRequest {
    target: number;
    value: number;
    speed: number;

    constructor(target: number, value: number) {
        this.target = target;
        this.value = value;
    }
}