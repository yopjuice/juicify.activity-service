import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { AppModule } from '../src/app/app.module.js';
import { FavoritesServiceClient } from '@juice11-micro/contracts';
import {
    grpcLoader,
  grpcPackages,
  grpcProtoPaths,
} from '../src/infrastructure/grpc/gprc.options.js';
import { MyConfigService } from '../src/config/config.service.js';
import { DatabaseProvider } from '../src/infrastructure/db/db.provider.js';
import { FavoriteRepo } from '../src/infrastructure/favorite/favorite.repo.js';
import { FavoriteFixtures } from '../src/modules/favorite/fixtures/favorite.fixture.js';
import { GrpcToPromise } from '../src/shared/types/index.js';
import { FavoriteGrpc } from '../src/infrastructure/favorite/favorite.client.js';
import getFreePort from 'get-port';
import { EventRmqClient } from '../src/infrastructure/event/event.client.js';

// TODO: add separate database for testing
describe('Favorite gRPC (e2e)', () => {
  let app: INestMicroservice;
  let wrapper: FavoriteGrpc;
  let client: GrpcToPromise<FavoritesServiceClient>;
  let rmqClient: EventRmqClient;
  let db: DatabaseProvider;
  let repo: FavoriteRepo;

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

    wrapper = moduleFixture.get<FavoriteGrpc>(FavoriteGrpc);
    client = wrapper.client;

    db = moduleFixture.get<DatabaseProvider>(DatabaseProvider);
    repo = moduleFixture.get<FavoriteRepo>(FavoriteRepo);

    rmqClient = moduleFixture.get<EventRmqClient>(EventRmqClient);
  });

  afterEach(async () => {
    // Clear database to avoid conflicts
    await db.query('TRUNCATE TABLE user_favorites CASCADE;');
  });

  afterAll(async () => {
    await app.close();
  });


  it('should get all user favorites via gRPC', async () => {
    const fav = await repo.add(FavoriteFixtures.addDto());

    const dto = FavoriteFixtures.getUserFavoriteDto();
    console.log({dto});
    const response = await client.getUserFavorites(dto);

    expect(response).toBeDefined();
    expect(response).toHaveProperty('itemIds');
    expect(response.itemIds).toHaveLength(1);
    expect(response.itemIds[0]).toEqual(fav.itemId);
  });


  it('should returned checked user favorites via gRPC', async () => {
    const fav = await repo.add(FavoriteFixtures.addDto())

    const dto = FavoriteFixtures.checkFavoriteDto({itemIds: [fav.itemId]});
    const response = await client.checkFavorites(dto);

    expect(response).toBeDefined();
    expect(response).toHaveProperty('results');
    expect(response.results).toHaveProperty(dto.itemIds[0]);
    expect(response.results[dto.itemIds[0]]).toEqual(true);
  });



  describe('Validation errors', () => {
    it.each([
      {
        method: 'checkFavorites',
        field: 'userId',
        call: () =>
          client.checkFavorites(FavoriteFixtures.checkFavoriteDto({ userId: 'invalid-uuid-format' })),
      },
      {
        method: 'checkFavorites',
        field: 'userId',
        call: () =>
          client.getUserFavorites(FavoriteFixtures.getUserFavoriteDto({ userId: 'invalid-uuid-format' })),
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
