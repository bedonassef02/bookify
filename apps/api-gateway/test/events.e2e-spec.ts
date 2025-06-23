import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateEventDto, UpdateEventDto } from '@app/shared';

describe('Events E2E Tests', () => {
  let app: INestApplication;
  let createdEventId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    if (createdEventId) {
      try {
        await request(app.getHttpServer())
          .delete(`/events/${createdEventId}`)
          .expect(204);
      } catch (error) {}
    }
    await app.close();
  });

  describe('/events (POST)', () => {
    it('should create a new event', async () => {
      const createEventDto: CreateEventDto = {
        title: 'E2E Test Event',
        description: 'E2E Test Description',
        date: new Date('2024-12-25T10:00:00Z'),
        location: 'E2E Test Location',
        capacity: 100,
        organizerId: '507f1f77bcf86cd799439011',
      };

      const response = await request(app.getHttpServer())
        .post('/events')
        .send(createEventDto)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.title).toBe(createEventDto.title);
      expect(response.body.description).toBe(createEventDto.description);
      expect(response.body.capacity).toBe(createEventDto.capacity);

      createdEventId = response.body._id;
    });

    it('should validate required fields', async () => {
      const invalidDto = {
        title: 'Missing Required Fields',
      };

      const response = await request(app.getHttpServer())
        .post('/events')
        .send(invalidDto)
        .expect(400);

      // The actual error message format
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
    });

    it('should reject invalid capacity', async () => {
      const invalidDto = {
        title: 'Invalid Capacity Event',
        description: 'Test Description',
        date: new Date('2024-12-25T10:00:00Z'),
        location: 'Test Location',
        capacity: 0, // Min is 1
        organizerId: '507f1f77bcf86cd799439011',
      };

      const response = await request(app.getHttpServer())
        .post('/events')
        .send(invalidDto)
        .expect(400);

      expect(response.body.statusCode).toBe(400);
    });
  });

  describe('/events (GET)', () => {
    it('should return all events', async () => {
      const response = await request(app.getHttpServer())
        .get('/events')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('/events/:id (GET)', () => {
    it('should return a specific event', async () => {
      const response = await request(app.getHttpServer())
        .get(`/events/${createdEventId}`)
        .expect(200);

      expect(response.body._id).toBe(createdEventId);
      expect(response.body.title).toBe('E2E Test Event');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app.getHttpServer())
        .get('/events/invalid-id')
        .expect(400);

      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe('Invalid ID format');
    });

    it('should return 404 for non-existent event', async () => {
      const response = await request(app.getHttpServer())
        .get('/events/507f1f77bcf86cd799439999')
        .expect(404);

      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('/events/:id (PATCH)', () => {
    it('should update an event', async () => {
      const updateDto: UpdateEventDto = {
        title: 'Updated E2E Event',
        capacity: 200,
      };

      const response = await request(app.getHttpServer())
        .patch(`/events/${createdEventId}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.title).toBe(updateDto.title);
      expect(response.body.capacity).toBe(updateDto.capacity);
      expect(response.body.description).toBe('E2E Test Description'); // Unchanged
    });

    it('should validate update data', async () => {
      const invalidUpdateDto = {
        capacity: 0,
      };

      const response = await request(app.getHttpServer())
        .patch(`/events/${createdEventId}`)
        .send(invalidUpdateDto)
        .expect(400);

      expect(response.body.statusCode).toBe(400);
    });
  });

  describe('/events/:id (DELETE)', () => {
    it('should delete an event', async () => {
      const eventToDelete = await request(app.getHttpServer())
        .post('/events')
        .send({
          title: 'Event to Delete',
          description: 'Will be deleted',
          date: new Date('2024-12-25T10:00:00Z'),
          location: 'Delete Location',
          capacity: 50,
          organizerId: '507f1f77bcf86cd799439011',
        })
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/events/${eventToDelete.body._id}`)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/events/${eventToDelete.body._id}`)
        .expect(404);
    });
  });
});
