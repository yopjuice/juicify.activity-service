import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { AppModule } from '../src/app/app.module.js';
import { InteractionServiceClient } from '@juice11-micro/contracts';
import {
  grpcPackages,
  grpcProtoPaths,
} from '../src/infrastructure/grpc/gprc.options.js';
import { MyConfigService } from '../src/config/config.service.js';
import { DatabaseProvider } from '../src/infrastructure/db/db.provider.js';
import { InteractionRepo } from '../src/infrastructure/interaction/interaction.repo.js';
import { InteractionFixtures } from '../src/modules/interaction/fixtures/interaction.fixture.js';
import { GrpcToPromise } from '../src/shared/types/index.js';
import { InteractionGrpc } from '../src/infrastructure/interaction/interaction.client.js';
import getFreePort from 'get-port';
import { EventRmqClient } from '../src/infrastructure/event/event.client.js';

// TODO: add separate database for testing
describe('Interaction gRPC (e2e)', () => {
  let app: INestMicroservice;
  let wrapper: InteractionGrpc;
  let client: GrpcToPromise<InteractionServiceClient>;
  let rmqClient: EventRmqClient;
  let db: DatabaseProvider;
  let repo: InteractionRepo;

  beforeAll(async () => {

    // use any free port for testing
    const testPort = await getFreePort();
    process.env.GRPC_PORT = testPort.toString();


    // Create testing module with all dependencies
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const config = moduleFixture.get<MyConfigService>(MyConfigService);
    const port = config.get('grpc.port');

    const protoOptions = {
      transport: Transport.GRPC as const,
      options: {
        url: `localhost:${port}`,
        package: grpcPackages,
        protoPath: grpcProtoPaths,
      },
    };

    // init app as microservice
    app = moduleFixture.createNestMicroservice(protoOptions);
    await app.listen();

    wrapper = moduleFixture.get<InteractionGrpc>(InteractionGrpc);
    client = wrapper.client;

    db = moduleFixture.get<DatabaseProvider>(DatabaseProvider);
    repo = moduleFixture.get<InteractionRepo>(InteractionRepo);

    rmqClient = moduleFixture.get<EventRmqClient>(EventRmqClient);
  });

  afterEach(async () => {
    // Clear database to avoid conflicts
    await db.query('TRUNCATE TABLE user_interactions CASCADE;');
  });

  afterAll(async () => {
    await app.close();
  });


  it('should get all user interactions via gRPC', async () => {
    const dto = InteractionFixtures.logDto();
    const log = await repo.log({ ...dto, actionType: 'VIEW', weight: 5 });

    const response = await client.getUserActivity(InteractionFixtures.getUserActivityDto());

    expect(response).toBeDefined();
    expect(response).toHaveProperty('logs');
    expect(response.logs).toHaveLength(1);
    expect(response.logs[0]).toHaveProperty('id');
    expect(response.logs[0].userId).toEqual(log.userId);
  });


  describe('Validation errors', () => {
    it.each([
      {
        method: 'findByUser',
        field: 'userId',
        call: () => client.getUserActivity({ userId: 'invalid-uuid-format', limit: 2 }),
      },
    ])(
      'should return gRPC INVALID_ARGUMENT error when $method params are invalid',
      async ({ call, field }) => {
        await expect(call()).rejects.toMatchObject({
          code: 13,
          details: expect.stringContaining(field),
        });
      },
    );
  });
});
