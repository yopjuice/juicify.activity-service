import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteController } from './favorite.controller.js';
import { FavoriteService } from './favorite.service.js';
import { FavoriteFixtures } from './fixtures/favorite.fixture.js';
import { createAutoMock } from '../../shared/utils/auto-mock.js';

describe('FavoriteController', () => {
  let controller: FavoriteController;
  let service: FavoriteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoriteController],
      providers: [
        {
          provide: FavoriteService,
          useValue: createAutoMock(FavoriteService),
        },
      ],
    }).compile();

    controller = module.get<FavoriteController>(FavoriteController);
    service = module.get<FavoriteService>(FavoriteService);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  describe('checkFavorite', () => {
    it('should return a list of favorites', async () => {
      const expected = FavoriteFixtures.idsArray();
      vi.mocked(service.getLikedSubset).mockResolvedValue(expected);

      const dto = FavoriteFixtures.checkFavoriteDto();

      const result = await controller.checkFavorite(dto);

      expect(service.getLikedSubset).toHaveBeenCalled();
      expect(result).toHaveProperty('results');
      expect(result.results).toBeTypeOf('object');
    });
  });

  describe('getUserFavorite', () => {
    it('should return a list of favorites', async () => {
      const expected = FavoriteFixtures.idsArray();
      vi.mocked(service.getByUser).mockResolvedValue(expected);

      const dto = FavoriteFixtures.getUserFavoriteDto();

      const result = await controller.getUserFavorite(dto);

      expect(service.getByUser).toHaveBeenCalled();
      expect(result).toHaveProperty('itemIds');
      expect(result.itemIds).toEqual(expected);
    });

    it('should return empty list if favs not found', async () => {
      const expected = [];
      vi.mocked(service.getByUser).mockResolvedValue(expected);

      const dto = FavoriteFixtures.getUserFavoriteDto();

      const result = await controller.getUserFavorite(dto);

      expect(service.getByUser).toHaveBeenCalled();
      expect(result).toHaveProperty('itemIds');
      expect(result.itemIds).toEqual(expected);
    });

  });

});
