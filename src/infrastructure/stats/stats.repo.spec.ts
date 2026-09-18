import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteRepo } from './favorite.repo.js';
import { DatabaseProvider } from '../db/db.provider.js';
import { FavoriteFixtures } from '../../modules/favorite/fixtures/favorite.fixture.js';
import { createAutoMock } from '../../shared/utils/auto-mock.js';

describe('FavoriteRepo', () => {
  let repo: FavoriteRepo;
  let db: DatabaseProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteRepo,
        {
          provide: DatabaseProvider,
          useValue: createAutoMock(DatabaseProvider),
        },
      ],
    }).compile();

    repo = module.get<FavoriteRepo>(FavoriteRepo);
    db = module.get<DatabaseProvider>(DatabaseProvider);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('add', () => {
    it('should return added favorite', async () => {
      const payload = FavoriteFixtures.addPayload();
      const expected = FavoriteFixtures.entity();
      vi.mocked(db.runOne).mockResolvedValue(FavoriteFixtures.raw());

      const result = await repo.add(payload);

      expect(db.runOne).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });


  describe('getByUser', () => {
    it('should return user favorites', async () => {
      const expected = FavoriteFixtures.array();
      vi.mocked(db.run).mockResolvedValue(FavoriteFixtures.rawArray());

      const payload = FavoriteFixtures.getUserFavoritePayload();

      const result = await repo.getByUser(payload);

      expect(db.run).toHaveBeenCalled();
      expect(result).toEqual(expected.map(item => item.itemId));
    });

    it('should return an empty list if no favorites are found', async () => {
      const expected = [];
      vi.mocked(db.run).mockResolvedValue(expected);

      const payload = FavoriteFixtures.getUserFavoritePayload();


      const result = await repo.getByUser(payload);

      expect(db.run).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('delete', () => {
    it('should return true on success', async () => {
      vi.mocked(db.runOne).mockResolvedValue(FavoriteFixtures.raw());

      const payload = FavoriteFixtures.deletePayload();


      const result = await repo.delete(payload);

      expect(db.runOne).toHaveBeenCalled();
      expect(result).toEqual(true);
    });

    it('should return false on failure', async () => {

      vi.mocked(db.runOne).mockResolvedValue([]);

      const payload = FavoriteFixtures.deletePayload();


      const result = await repo.delete(payload);

      expect(db.runOne).toHaveBeenCalled();
      expect(result).toEqual(true);
    });
  });
});
