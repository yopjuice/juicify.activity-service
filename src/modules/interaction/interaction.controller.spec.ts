import { Test, TestingModule } from '@nestjs/testing';
import { InteractionController } from './interaction.controller.js';
import { InteractionService } from './interaction.service.js';
import { InteractionFixtures } from './fixtures/interaction.fixture.js';
import { createAutoMock } from '../../shared/utils/auto-mock.js';

describe('InteractionController', () => {
  let controller: InteractionController;
  let service: InteractionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InteractionController],
      providers: [
        {
          provide: InteractionService,
          useValue: createAutoMock(InteractionService),
        },
      ],
    }).compile();

    controller = module.get<InteractionController>(InteractionController);
    service = module.get<InteractionService>(InteractionService);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  describe('findByUser', () => {
    it('should return a list of interactions', async () => {
      const expected = InteractionFixtures.array();
      vi.mocked(service.findByUser).mockResolvedValue(expected);

      const dto = InteractionFixtures.getUserActivityDto({userId: expected[0].userId});

      const result = await controller.findByUser(dto);

      expect(service.findByUser).toHaveBeenCalled();
      expect(result).toHaveProperty('logs');
      expect(result.logs).toEqual(expected);
    });

    it('should return empty list if logs not found', async () => {
      const expected = [];
      vi.mocked(service.findByUser).mockResolvedValue(expected);

      const dto = InteractionFixtures.getUserActivityDto();

      const result = await controller.findByUser(dto);

      expect(service.findByUser).toHaveBeenCalled();
      expect(result).toHaveProperty('logs');
      expect(result.logs).toEqual(expected);
    });
  });

});
