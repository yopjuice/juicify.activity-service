import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteService } from './favorite.service.js';
import { FavoriteRepo } from '../../infrastructure/favorite/favorite.repo.js';
import { FavoriteFixtures } from './fixtures/favorite.fixture.js';
import { createAutoMock } from '../../shared/utils/auto-mock.js';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let repo: FavoriteRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        {
          provide: FavoriteRepo,
          useValue: createAutoMock(FavoriteRepo),
        },
      ],
    }).compile();

    service = module.get<FavoriteService>(FavoriteService);
    repo = module.get<FavoriteRepo>(FavoriteRepo);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('checkFavorite', () => {
    it('should return a list of favorites', async () => {
      const expected = FavoriteFixtures.idsArray();
      vi.mocked(repo.getLikedSubset).mockResolvedValue(expected);

      const payload = FavoriteFixtures.checkFavoriteDto();

      const result = await service.getLikedSubset(payload);

      expect(repo.getLikedSubset).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getUserFavorite', () => {
    it('should return a list of favorites', async () => {
      const expected = FavoriteFixtures.idsArray();
      vi.mocked(repo.getByUser).mockResolvedValue(expected);

      const payload = FavoriteFixtures.getUserFavoritePayload();

      const result = await service.getByUser(payload);

      expect(repo.getByUser).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array);
    });

    it('should return empty list if favs not found', async () => {
      const expected = [];
      vi.mocked(repo.getByUser).mockResolvedValue(expected);

      const payload = FavoriteFixtures.getUserFavoritePayload();

      const result = await service.getByUser(payload);

      expect(repo.getByUser).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

  });
});
