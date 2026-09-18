import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from './stats.service.js';
import { StatsRepo } from '../../infrastructure/stats/stats.repo.js';
import { StatsFixtures } from './fixtures/stats.fixture.js';
import { createAutoMock } from '../../shared/utils/auto-mock.js';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('StatsService', () => {
  let service: StatsService;
  let repo: StatsRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        {
          provide: StatsRepo,
          useValue: createAutoMock(StatsRepo),
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: vi.fn(),
            set: vi.fn(),
          },
        }
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
    repo = module.get<StatsRepo>(StatsRepo);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });


  describe('getTopItems', () => {
    it('should return a list of top items', async () => {
      const expected = StatsFixtures.array();
      vi.mocked(repo.getTopItems).mockResolvedValue(expected);

      const dto = StatsFixtures.getTopItemsDto();

      const result = await service.getTopItems(dto);

      expect(repo.getTopItems).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should return empty list if no activity detected', async () => {
      const expected = [];
      vi.mocked(repo.getTopItems).mockResolvedValue(expected);

      const dto = StatsFixtures.getTopItemsDto();

      const result = await service.getTopItems(dto);

      expect(repo.getTopItems).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });
});
