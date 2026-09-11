import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { AppModule } from '../src/app/app.module.js';
import { MyConfigService } from '../src/config/config.service.js';
import { DatabaseProvider } from '../src/infrastructure/db/db.provider.js';
import { RMQ_QUEUE_NAME, RMQ_QUEUE_OPTIONS } from '../src/infrastructure/rmq/rmq.options.js';
import { InteractionFixtures } from '../src/modules/interaction/fixtures/interaction.fixture.js';
import { EventRmqClient } from '../src/infrastructure/event/event.client.js';
import { ACTIVITY_PATTERNS } from '../src/modules/event/event.patterns.js';
import { InteractionRepo } from '../src/infrastructure/interaction/interaction.repo.js';

// TODO: add separate database for testing
describe('Event gRPC (e2e)', () => {
  let app: INestMicroservice;
  let client: EventRmqClient;
  let db: DatabaseProvider;
  let interRepo: InteractionRepo;

  beforeAll(async () => {


    // Create testing module with all dependencies
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const config = moduleFixture.get<MyConfigService>(MyConfigService);
    const port = config.get('rmq.port');
    const host = config.get('rmq.host');


    const url = `amqp://${host}:${port}`

    const rmqOptions = {
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue: RMQ_QUEUE_NAME,
        noAck: false,
        queueOptions: RMQ_QUEUE_OPTIONS,
      },
    };

    // init app as microservice
    app = moduleFixture.createNestMicroservice(rmqOptions);
    await app.listen();

    client = moduleFixture.get<EventRmqClient>(EventRmqClient);

    db = moduleFixture.get<DatabaseProvider>(DatabaseProvider);

    interRepo = moduleFixture.get<InteractionRepo>(InteractionRepo);
  });

  afterEach(async () => {
    // Clear database to avoid conflicts
    await db.query(`TRUNCATE TABLE user_interactions CASCADE;`);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create event via RMQ', async () => {
    const dto = InteractionFixtures.logDto();
    const response = await client.emit(ACTIVITY_PATTERNS.CATALOG.ITEM.VIEWED, dto);

    expect(response).toEqual(undefined);
  });


  describe('Validation errors', () => {
    it.each([
      {
        method: 'log',
        field: 'id',
        call: () => client.emit(
          ACTIVITY_PATTERNS.CATALOG.ITEM.VIEWED,
          { ...InteractionFixtures.logDto({ userId: 'invalid-uuid-format' }) }
        ),
      },
    ])(
      'should handle errors when $method params are invalid',
      async ({ call, field }) => {
        await expect(call()).resolves.toEqual(undefined);

        await new Promise(res => setTimeout(res, 150));

        const res = await interRepo.findAll();

        expect(res).toEqual([]);
      },
    );
  });
});
