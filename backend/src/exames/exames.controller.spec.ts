import { Test, TestingModule } from '@nestjs/testing';
import { ExamesController } from './exames.controller';
import { ExamesService } from './exames.service';

describe('ExamesController', () => {
  let controller: ExamesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamesController],
      providers: [ExamesService],
    }).compile();

    controller = module.get<ExamesController>(ExamesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
