import { TestBed } from '@angular/core/testing';

import { CloudVisionApiService } from './cloud-vision-api.service';

describe('CloudVisionApiService', () => {
  let service: CloudVisionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloudVisionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
