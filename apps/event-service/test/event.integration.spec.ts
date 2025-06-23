import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { EventController } from '../src/event.controller';
import { EventService } from '../src/event.service';
import { EventRepository } from '../src/repositories/event.repository';
import { Event, EventSchema } from '../src/entities/event.entity';
import { CreateEventDto } from '@app/shared';

describe('Event Service Integration Tests', () => {
  let module: TestingModule;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let eventController: EventController;

  beforeAll(async () => {
    // Start in-memory MongoDB
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        CacheModule.register(),
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
      ],
      controllers: [EventController],
      providers: [EventService, EventRepository],
    }).compile();

    eventController = module.get<EventController>(EventController);
    mongoConnection = module.get<Connection>(getConnectionToken());
  });

  afterAll(async () => {
    await mongoConnection.close();
    await module.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  const testEvent: CreateEventDto = {
    title: 'Test Event',
    description: 'Test Description',
    date: new Date('2024-12-25T10:00:00Z'),
    location: 'Test Location',
    capacity: 100,
    organizerId: '507f1f77bcf86cd799439011',
  };

  describe('Basic CRUD Operations', () => {
    it('should create and find an event', async () => {
      const created = await eventController.create(testEvent);
      expect(created).toBeDefined();
      expect(created.title).toBe(testEvent.title);
      expect((created as any)._id).toBeDefined();

      const found = await eventController.findOne({
        id: (created as any)._id.toString(),
      });
      expect(found).toBeDefined();
      expect(found!.title).toBe(testEvent.title);
    });

    it('should update an event', async () => {
      const created = await eventController.create(testEvent);

      const updated = await eventController.update({
        id: (created as any)._id.toString(),
        eventDto: { title: 'Updated Title' },
      });

      expect(updated.title).toBe('Updated Title');
    });

    it('should delete an event', async () => {
      const created = await eventController.create(testEvent);
      const createdId = (created as any)._id.toString();

      const deleted = await eventController.remove({ id: createdId });
      expect(deleted).toBeDefined();
      expect((deleted as any)._id.toString()).toBe(createdId);

      await expect(
        eventController.findOne({ id: createdId }),
      ).rejects.toThrow();
    });

    it('should list all events', async () => {
      await eventController.create(testEvent);
      await eventController.create({ ...testEvent, title: 'Event 2' });

      const events = await eventController.findAll();
      expect(events.length).toBeGreaterThanOrEqual(2);
    });
  });
});
