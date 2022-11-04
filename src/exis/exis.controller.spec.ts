import { Test, TestingModule } from '@nestjs/testing';
import { ExisController } from './exis.controller';

describe('ExisController', () => {
  let controller: ExisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExisController],
    }).compile();

    controller = module.get<ExisController>(ExisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
