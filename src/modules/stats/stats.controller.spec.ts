import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from './stats.controller.js';
import { StatsService } from './stats.service.js';
import { StatsFixtures } from './fixtures/stats.fixture.js';
import { createAutoMock } from '../../shared/utils/auto-mock.js';

describe('StatsController', () => {
  let controller: StatsController;
  let service: StatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
      providers: [
        {
          provide: StatsService,
          useValue: createAutoMock(StatsService),
        },
      ],
    }).compile();

    controller = module.get<StatsController>(StatsController);
    service = module.get<StatsService>(StatsService);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  describe('getTopItems', () => {
    it('should return a list of top items', async () => {
      const expected = StatsFixtures.array();
      vi.mocked(service.getTopItems).mockResolvedValue(expected);

      const dto = StatsFixtures.getTopItemsDto();

      const result = await controller.getTopItems(dto);

      expect(service.getTopItems).toHaveBeenCalled();
      expect(result).toHaveProperty('items');
      expect(result.items).toEqual(expected);
    });

    it('should return empty list if no activity detected', async () => {
      const expected = [];
      vi.mocked(service.getTopItems).mockResolvedValue(expected);

      const dto = StatsFixtures.getTopItemsDto();

      const result = await controller.getTopItems(dto);

      expect(service.getTopItems).toHaveBeenCalled();
      expect(result).toHaveProperty('items');
      expect(result.items).toEqual(expected);
    });
  });

});
