import { TestBed } from '@angular/core/testing';

import { GpioWebsocketsService } from './gpio-websockets.service';

describe('GpioWebsocketsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GpioWebsocketsService = TestBed.get(GpioWebsocketsService);
    expect(service).toBeTruthy();
  });
});
