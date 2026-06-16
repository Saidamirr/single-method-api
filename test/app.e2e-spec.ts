import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { LocusController } from '../src/locus/locus.controller';
import { LocusService } from '../src/locus/locus.service';
import { JwtAuthGuard } from '../src/auth/jwt/jwt.guard';
import { RolesGuard } from '../src/auth/roles/roles.guard';

describe('GET /locus (e2e)', () => {
  let app: INestApplication<App>;
  const locusService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    locusService.findAll.mockResolvedValue([{ id: 1, assemblyId: 'GRCh38' }]);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [LocusController],
      providers: [{ provide: LocusService, useValue: locusService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context
            .switchToHttp()
            .getRequest<{ user?: { role: string } }>();
          req.user = { role: 'admin' };
          return true;
        },
      })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  it('returns loci without using a real database', async () => {
    await request(app.getHttpServer())
      .get('/locus?assemblyId=GRCh38&page=1')
      .expect(200)
      .expect([{ id: 1, assemblyId: 'GRCh38' }]);

    expect(locusService.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ assemblyId: 'GRCh38', page: 1 }),
      { role: 'admin' },
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });
});
