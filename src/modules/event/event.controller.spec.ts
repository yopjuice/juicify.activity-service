import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller.js';
import { InteractionService } from '../../modules/interaction/interaction.service.js';
import { InteractionFixtures } from '../interaction/fixtures/interaction.fixture.js';
import { createAutoMock } from '../../shared/utils/auto-mock.js';
import { FavoriteService } from '../favorite/favorite.service.js';

describe('EventController', () => {
  let controller: EventController;
  let service: InteractionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventController,
        {
          provide: InteractionService,
          useValue: createAutoMock(InteractionService),
        },
        {
          provide: FavoriteService,
          useValue: createAutoMock(FavoriteService),
        }
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
    service = module.get<InteractionService>(InteractionService);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('log', () => {
    it('should return void on success', async () => {
      const payload = InteractionFixtures.logPayload();
      const expected = InteractionFixtures.entity();
      vi.mocked(service.log).mockResolvedValue(expected);

      const result = await controller.handleItemViewed(payload);

      expect(service.log).toHaveBeenCalledWith(payload);
      expect(result).toEqual(undefined);
    });
  });

});
