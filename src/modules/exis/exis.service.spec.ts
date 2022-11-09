import { Test, TestingModule } from '@nestjs/testing';
import { ExisService } from './exis.service';

describe('ExisService', () => {
  let service: ExisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExisService],
    }).compile();

    service = module.get<ExisService>(ExisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
