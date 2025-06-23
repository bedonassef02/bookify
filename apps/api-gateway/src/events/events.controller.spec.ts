import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { ClientProxy } from '@nestjs/microservices';
import { CreateEventDto } from '../../../event-service/src/dto/create-event.dto';
import { UpdateEventDto } from '../../../event-service/src/dto/update-event.dto';
import { of } from 'rxjs';
import { CacheModule } from '@nestjs/cache-manager';
import { PATTERNS } from '@app/shared';

describe('EventsController (API Gateway)', () => {
  let controller: EventsController;
  let clientProxy: ClientProxy;

  const mockEvent = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Event',
    description: 'Test Description',
    date: new Date('2024-12-25T10:00:00Z'),
    location: 'Test Location',
    capacity: 100,
    organizerId: '507f1f77bcf86cd799439012',
  };

  const mockClientProxy = {
    send: jest.fn(),
    emit: jest.fn(),
    connect: jest.fn(),
    close: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [EventsController],
      providers: [
        {
          provide: 'EVENT_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    clientProxy = module.get<ClientProxy>('EVENT_SERVICE');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all events', () => {
      const events = [mockEvent];
      mockClientProxy.send.mockReturnValue(of(events));

      const result = controller.findAll();

      expect(clientProxy.send).toHaveBeenCalledWith(
        PATTERNS.EVENTS.FIND_ALL,
        {},
      );
      result.subscribe((data) => {
        expect(data).toEqual(events);
      });
    });
  });

  describe('findOne', () => {
    it('should return a single event', () => {
      const id = '507f1f77bcf86cd799439011';
      mockClientProxy.send.mockReturnValue(of(mockEvent));

      const result = controller.findOne(id);

      expect(clientProxy.send).toHaveBeenCalledWith(PATTERNS.EVENTS.FIND_ONE, {
        id,
      });
      result.subscribe((data) => {
        expect(data).toEqual(mockEvent);
      });
    });
  });

  describe('create', () => {
    it('should create an event', () => {
      const createEventDto: CreateEventDto = {
        title: 'New Event',
        description: 'New Description',
        date: new Date('2024-12-25T10:00:00Z'),
        location: 'New Location',
        capacity: 50,
        organizerId: '507f1f77bcf86cd799439012',
      };

      mockClientProxy.send.mockReturnValue(of(mockEvent));

      const result = controller.create(createEventDto);

      expect(clientProxy.send).toHaveBeenCalledWith(
        PATTERNS.EVENTS.CREATE,
        createEventDto,
      );
      result.subscribe((data) => {
        expect(data).toEqual(mockEvent);
      });
    });
  });

  describe('update', () => {
    it('should update an event', () => {
      const id = '507f1f77bcf86cd799439011';
      const updateEventDto: UpdateEventDto = {
        title: 'Updated Event',
        capacity: 200,
      };

      mockClientProxy.send.mockReturnValue(of(mockEvent));

      const result = controller.update(id, updateEventDto);

      expect(clientProxy.send).toHaveBeenCalledWith(PATTERNS.EVENTS.UPDATE, {
        id,
        eventDto: updateEventDto,
      });
      result.subscribe((data) => {
        expect(data).toEqual(mockEvent);
      });
    });
  });

  describe('remove', () => {
    it('should remove an event', () => {
      const id = '507f1f77bcf86cd799439011';
      mockClientProxy.send.mockReturnValue(of(undefined));

      const result = controller.remove(id);

      expect(clientProxy.send).toHaveBeenCalledWith(PATTERNS.EVENTS.REMOVE, {
        id,
      });
      result.subscribe((data) => {
        expect(data).toBeUndefined();
      });
    });
  });
});
