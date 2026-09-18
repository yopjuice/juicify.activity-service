import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { AppModule } from '../src/app/app.module.js';
import { StatsServiceClient } from '@juice11-micro/contracts';
import {
    grpcLoader,
  grpcPackages,
  grpcProtoPaths,
} from '../src/infrastructure/grpc/gprc.options.js';
import { MyConfigService } from '../src/config/config.service.js';
import { DatabaseProvider } from '../src/infrastructure/db/db.provider.js';
import { StatsFixtures } from '../src/modules/stats/fixtures/stats.fixture.js';
import { GrpcToPromise } from '../src/shared/types/index.js';
import { StatsGrpc } from '../src/infrastructure/stats/stats.client.js';
import getFreePort from 'get-port';
import { InteractionRepo } from '../src/infrastructure/interaction/interaction.repo.js';
import { InteractionFixtures } from '../src/modules/interaction/fixtures/interaction.fixture.js';

// TODO: add separate database for testing
describe('Stats gRPC (e2e)', () => {
  let app: INestMicroservice;
  let wrapper: StatsGrpc;
  let client: GrpcToPromise<StatsServiceClient>;
  let db: DatabaseProvider;
  let interRepo: InteractionRepo;

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
        loader: grpcLoader, 
      },
    };

    // init app as microservice
    app = moduleFixture.createNestMicroservice(protoOptions);
    await app.listen();

    wrapper = moduleFixture.get<StatsGrpc>(StatsGrpc);
    client = wrapper.client;

    db = moduleFixture.get<DatabaseProvider>(DatabaseProvider);
    interRepo = moduleFixture.get<InteractionRepo>(InteractionRepo);
  });

  afterEach(async () => {
    // Clear database to avoid conflicts
    await db.query('TRUNCATE TABLE user_interactions CASCADE;');
  });

  afterAll(async () => {
    await app.close();
  });


  it('should get all user stats via gRPC', async () => {
    const stat = await interRepo.log(InteractionFixtures.logPayload());

    const dto = StatsFixtures.getTopItemsDto();
    const response = await client.getTopItems(dto);

    expect(response).toBeDefined();
    expect(response).toHaveProperty('items');
    expect(response.items).toHaveLength(1);
    expect(response.items[0]).toEqual({itemId: stat.itemId, score: expect.any(Number)});
  });


  describe('Validation errors', () => {
    it.each([
      {
        method: 'getTopItems',
        field: 'itemType',
        call: () =>
          client.getTopItems(StatsFixtures.getTopItemsDto({ itemType: 'invalid-item-type' } as any)),
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
