import { Test, TestingModule } from '@nestjs/testing';
import { InteractionRepo } from './interaction.repo.js';
import { DatabaseProvider } from '../db/db.provider.js';
import { InteractionFixtures } from '../../modules/interaction/fixtures/interaction.fixture.js';
import { createAutoMock } from '../../shared/utils/auto-mock.js';

describe('InteractionRepo', () => {
  let repo: InteractionRepo;
  let db: DatabaseProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InteractionRepo,
        {
          provide: DatabaseProvider,
          useValue: createAutoMock(DatabaseProvider),
        },
      ],
    }).compile();

    repo = module.get<InteractionRepo>(InteractionRepo);
    db = module.get<DatabaseProvider>(DatabaseProvider);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('log', () => {
    it('should return logged interaction', async () => {
      const payload = InteractionFixtures.logPayload();
      const expected = InteractionFixtures.entity();
      vi.mocked(db.runOne).mockResolvedValue(InteractionFixtures.raw());

      const result = await repo.log(payload);

      expect(db.runOne).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return a list of interactions', async () => {
      const expected = InteractionFixtures.array();
      vi.mocked(db.run).mockResolvedValue(InteractionFixtures.rawArray());

      const result = await repo.findAll();

      expect(db.run).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should return an empty list if no interactions are found', async () => {
      const expected = [];
      vi.mocked(db.run).mockResolvedValue(expected);

      const result = await repo.findAll();

      expect(db.run).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('findByUser', () => {
    it('should return user interactions', async () => {
      const expected = InteractionFixtures.array();
      vi.mocked(db.run).mockResolvedValue(InteractionFixtures.rawArray());

      const result = await repo.findByUser(expected[0].userId);

      expect(db.run).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should return an empty list if no interactions are found', async () => {
      const expected = [];
      vi.mocked(db.run).mockResolvedValue(expected);

      const result = await repo.findByUser('non-existent-id');

      expect(db.run).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('deleteById', () => {
    it('should return true on success', async () => {
      const expected = InteractionFixtures.entity();
      vi.mocked(db.runOne).mockResolvedValue(InteractionFixtures.raw());

      const result = await repo.deleteById(expected.id);

      expect(db.runOne).toHaveBeenCalled();
      expect(result).toEqual(true);
    });

    it('should return false on failure', async () => {

      vi.mocked(db.runOne).mockResolvedValue([]);

      const result = await repo.deleteById('non-existent-id');

      expect(db.runOne).toHaveBeenCalled();
      expect(result).toEqual(true);
    });
  });
});
