import { Test, TestingModule } from '@nestjs/testing';
import { StatsRepo } from './stats.repo.js';
import { DatabaseProvider } from '../db/db.provider.js';
import { StatsFixtures } from '../../modules/stats/fixtures/stats.fixture.js';
import { createAutoMock } from '../../shared/utils/auto-mock.js';

describe('StatsRepo', () => {
  let repo: StatsRepo;
  let db: DatabaseProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsRepo,
        {
          provide: DatabaseProvider,
          useValue: createAutoMock(DatabaseProvider),
        },
      ],
    }).compile();

    repo = module.get<StatsRepo>(StatsRepo);
    db = module.get<DatabaseProvider>(DatabaseProvider);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('getTopItems', () => {
    it('should return top stats', async () => {
      const payload = StatsFixtures.getTopItemsPayload();
      const expected = StatsFixtures.array();

      vi.mocked(db.run).mockResolvedValue(StatsFixtures.rawArray());

      const result = await repo.getTopItems(payload);

      expect(db.run).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should return an empty list if no stats are found', async () => {
      const expected = [];
      vi.mocked(db.run).mockResolvedValue(expected);

      const payload = StatsFixtures.getTopItemsPayload();


      const result = await repo.getTopItems(payload);

      expect(db.run).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });



});
