import { EntityNotFoundError } from '../../shared/errors/domain-errors.js';
import { Interaction } from './interaction.entity.js';
import { Test, TestingModule } from '@nestjs/testing';
import { InteractionService } from './interaction.service.js';
import { InteractionRepo } from '../../infrastructure/interaction/interaction.repo.js';
import { InteractionFixtures } from './fixtures/interaction.fixture.js';
import { createAutoMock } from '../../shared/utils/auto-mock.js';

describe('InteractionService', () => {
  let service: InteractionService;
  let repo: InteractionRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InteractionService,
        {
          provide: InteractionRepo,
          useValue: createAutoMock(InteractionRepo),
        },
      ],
    }).compile();

    service = module.get<InteractionService>(InteractionService);
    repo = module.get<InteractionRepo>(InteractionRepo);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('log', () => {
    it('should return logged interaction', async () => {
      const payload = InteractionFixtures.logPayload();
      const expected = InteractionFixtures.entity();
      vi.mocked(repo.log).mockResolvedValue(expected);

      const result = await service.log(payload);

      expect(repo.log).toHaveBeenCalledWith(payload);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return a list of interactions', async () => {
      const expected = InteractionFixtures.array();
      vi.mocked(repo.findAll).mockResolvedValue(expected);

      const result = await service.findAll();

      expect(repo.findAll).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should return an empty list if no interactions are found', async () => {
      const expected = [];
      vi.mocked(repo.findAll).mockResolvedValue(expected);

      const result = await service.findAll();

      expect(repo.findAll).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('findByUser', () => {
    it('should return user interactions', async () => {
      const expected = InteractionFixtures.array();
      vi.mocked(repo.findByUser).mockResolvedValue(expected);

      const result = await service.findByUser(expected[0].userId);

      expect(repo.findByUser).toHaveBeenCalledWith(expected[0].userId);
      expect(result).toEqual(expected);
    });

    it('should return an empty list if no interactions are found', async () => {
      const expected = [];
      vi.mocked(repo.findByUser).mockResolvedValue(expected);

      const result = await service.findByUser('non-existent-id');

      expect(repo.findByUser).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('deleteById', () => {
    it('should return undefined on success', async () => {
      const expected = InteractionFixtures.entity();
      vi.mocked(repo.deleteById).mockResolvedValue(true);

      const result = await service.deleteById(expected.id);

      expect(repo.deleteById).toHaveBeenCalledWith(expected.id);
      expect(result).toEqual(undefined);
    });

    it('should throw an error if the interaction is not found', async () => {
      vi.mocked(repo.deleteById).mockResolvedValue(false);

      const result = service.deleteById('non-existent-id');

      await expect(result).rejects.toThrow(EntityNotFoundError);
      expect(repo.deleteById).toHaveBeenCalledWith('non-existent-id');
    });
  });
});
