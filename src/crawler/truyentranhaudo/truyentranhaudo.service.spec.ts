import { Test, TestingModule } from '@nestjs/testing';
import { TruyentranhaudoService } from './truyentranhaudo.service';

describe('TruyentranhaudoService', () => {
  let service: TruyentranhaudoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TruyentranhaudoService],
    }).compile();

    service = module.get<TruyentranhaudoService>(TruyentranhaudoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
