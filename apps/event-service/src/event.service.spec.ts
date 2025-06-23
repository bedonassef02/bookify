import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { EventRepository } from './repositories/event.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';
import { Cache } from 'cache-manager';

describe('EventService', () => {
  let service: EventService;
  let repository: EventRepository;
  let cacheManager: Cache;

  const mockEvent = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Event',
    description: 'Test Description',
    date: new Date('2024-12-25T10:00:00Z'),
    location: 'Test Location',
    capacity: 100,
    organizerId: '507f1f77bcf86cd799439012',
  };

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: EventRepository,
          useValue: mockRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    repository = module.get<EventRepository>(EventRepository);
    cacheManager = module.get(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an event and clear cache', async () => {
      const createEventDto: CreateEventDto = {
        title: 'New Event',
        description: 'New Description',
        date: new Date('2024-12-25T10:00:00Z'),
        location: 'New Location',
        capacity: 50,
        organizerId: '507f1f77bcf86cd799439012',
      };

      mockRepository.create.mockResolvedValue(mockEvent);

      const result = await service.create(createEventDto);

      expect(repository.create).toHaveBeenCalledWith(createEventDto);
      expect(cacheManager.del).toHaveBeenCalledWith('events');
      expect(result).toEqual(mockEvent);
    });
  });

  describe('findAll', () => {
    it('should return cached events if available', async () => {
      const cachedEvents = [mockEvent];
      mockCacheManager.get.mockResolvedValue(cachedEvents);

      const result = await service.findAll();

      expect(cacheManager.get).toHaveBeenCalledWith('events');
      expect(repository.findAll).not.toHaveBeenCalled();
      expect(result).toEqual(cachedEvents);
    });

    it('should fetch from repository and cache if not cached', async () => {
      const events = [mockEvent];
      mockCacheManager.get.mockResolvedValue(null);
      mockRepository.findAll.mockResolvedValue(events);

      const result = await service.findAll();

      expect(cacheManager.get).toHaveBeenCalledWith('events');
      expect(repository.findAll).toHaveBeenCalled();
      expect(cacheManager.set).toHaveBeenCalledWith('events', events, 30000);
      expect(result).toEqual(events);
    });
  });

  describe('findOne', () => {
    it('should return cached event if available', async () => {
      mockCacheManager.get.mockResolvedValue(mockEvent);

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(cacheManager.get).toHaveBeenCalledWith(
        'event_507f1f77bcf86cd799439011',
      );
      expect(repository.findById).not.toHaveBeenCalled();
      expect(result).toEqual(mockEvent);
    });

    it('should fetch from repository and cache if not cached', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockRepository.findById.mockResolvedValue(mockEvent);

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(cacheManager.get).toHaveBeenCalledWith(
        'event_507f1f77bcf86cd799439011',
      );
      expect(repository.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
      expect(cacheManager.set).toHaveBeenCalledWith(
        'event_507f1f77bcf86cd799439011',
        mockEvent,
        30000,
      );
      expect(result).toEqual(mockEvent);
    });

    it('should throw RpcException if event not found', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(
        new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Event with ID 507f1f77bcf86cd799439011 not found',
        }),
      );
    });
  });

  describe('update', () => {
    it('should update event and update cache', async () => {
      const updateEventDto: UpdateEventDto = {
        title: 'Updated Event',
        capacity: 200,
      };
      const updatedEvent = { ...mockEvent, ...updateEventDto };

      mockRepository.update.mockResolvedValue(updatedEvent);

      const result = await service.update(
        '507f1f77bcf86cd799439011',
        updateEventDto,
      );

      expect(repository.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateEventDto,
      );
      expect(cacheManager.set).toHaveBeenCalledWith(
        'event_507f1f77bcf86cd799439011',
        updatedEvent,
        30000,
      );
      expect(cacheManager.del).toHaveBeenCalledWith('events');
      expect(result).toEqual(updatedEvent);
    });

    it('should throw RpcException if event not found', async () => {
      mockRepository.update.mockResolvedValue(null);

      await expect(
        service.update('507f1f77bcf86cd799439011', { title: 'Updated' }),
      ).rejects.toThrow(
        new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Event with ID 507f1f77bcf86cd799439011 not found',
        }),
      );
    });
  });

  describe('remove', () => {
    it('should delete event and clear cache', async () => {
      mockRepository.delete.mockResolvedValue(mockEvent);

      const result = await service.remove('507f1f77bcf86cd799439011');

      expect(repository.delete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
      expect(cacheManager.del).toHaveBeenCalledWith(
        'event_507f1f77bcf86cd799439011',
      );
      expect(cacheManager.del).toHaveBeenCalledWith('events');
      expect(result).toEqual(mockEvent);
    });

    it('should return null if event not found', async () => {
      mockRepository.delete.mockResolvedValue(null);

      const result = await service.remove('507f1f77bcf86cd799439011');

      expect(repository.delete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
      expect(cacheManager.del).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
