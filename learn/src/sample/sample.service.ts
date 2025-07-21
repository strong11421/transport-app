import { Injectable } from '@nestjs/common';

@Injectable()
export class SampleService {
  getHardcodedData() {
    return {
      message: 'This is hardcoded data',
      items: [
        { id: 1, name: 'Item One' },
        { id: 2, name: 'Item Two' },
        { id: 3, name: 'Item Three' },
      ],
    };
  }
}
