import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from '../src/url/entities/url.entity';

describe('URL Controller (e2e)', () => {
  let app: INestApplication;
  let mockUrlRepository;

  beforeEach(async () => {
    // Mock URL repository
    mockUrlRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(Url))
      .useValue(mockUrlRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/api/encode (POST)', () => {
    it('should encode a URL', async () => {
      // Mock the save method to return a sample URL
      const mockUrl = {
        id: 1,
        originalUrl: 'https://example.com',
        shortCode: 'abc123',
        clickCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUrlRepository.findOne.mockResolvedValue(null);
      mockUrlRepository.save.mockResolvedValue(mockUrl);

      return request(app.getHttpServer())
        .post('/api/encode')
        .send({ originalUrl: 'example.com' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('originalUrl', 'https://example.com');
          expect(res.body).toHaveProperty('shortCode', 'abc123');
          expect(res.body).toHaveProperty('shortUrl');
        });
    });

    it('should return 400 for invalid URL', () => {
      return request(app.getHttpServer())
        .post('/api/encode')
        .send({ originalUrl: '' })
        .expect(400);
    });
  });

  describe('/api/decode (GET)', () => {
    it('should decode a short URL', async () => {
      // Mock the findOne method to return a sample URL
      const mockUrl = {
        id: 1,
        originalUrl: 'https://example.com',
        shortCode: 'abc123',
        clickCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUrlRepository.findOne.mockResolvedValue(mockUrl);

      return request(app.getHttpServer())
        .get('/api/decode?shortUrl=http://localhost:4004/abc123')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('originalUrl', 'https://example.com');
        });
    });

    it('should return 404 for non-existent short URL', () => {
      mockUrlRepository.findOne.mockResolvedValue(null);

      return request(app.getHttpServer())
        .get('/api/decode?shortUrl=http://localhost:4004/nonexistent')
        .expect(404);
    });
  });
});
