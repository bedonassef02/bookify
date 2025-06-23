import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { CreateEventDto, UpdateEventDto } from '@app/shared';

describe('EventController', () => {
  let controller: EventController;
  let service: EventService;

  const mockEvent = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Event',
    description: 'Test Description',
    date: new Date('2024-12-25T10:00:00Z'),
    location: 'Test Location',
    capacity: 100,
    organizerId: '507f1f77bcf86cd799439012',
  };

  const mockEventService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: mockEventService,
        },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
    service = module.get<EventService>(EventService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return array of events', async () => {
      const events = [mockEvent];
      mockEventService.findAll.mockResolvedValue(events);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(events);
    });
  });

  describe('findOne', () => {
    it('should return a single event', async () => {
      mockEventService.findOne.mockResolvedValue(mockEvent);

      const result = await controller.findOne({
        id: '507f1f77bcf86cd799439011',
      });

      expect(service.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockEvent);
    });
  });

  describe('create', () => {
    it('should create and return event', async () => {
      const createEventDto: CreateEventDto = {
        title: 'New Event',
        description: 'New Description',
        date: new Date('2024-12-25T10:00:00Z'),
        location: 'New Location',
        capacity: 50,
        organizerId: '507f1f77bcf86cd799439012',
      };

      mockEventService.create.mockResolvedValue(mockEvent);

      const result = await controller.create(createEventDto);

      expect(service.create).toHaveBeenCalledWith(createEventDto);
      expect(result).toEqual(mockEvent);
    });
  });

  describe('update', () => {
    it('should update and return event', async () => {
      const updateEventDto: UpdateEventDto = {
        title: 'Updated Event',
      };

      mockEventService.update.mockResolvedValue(mockEvent);

      const result = await controller.update({
        id: '507f1f77bcf86cd799439011',
        eventDto: updateEventDto,
      });

      expect(service.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateEventDto,
      );
      expect(result).toEqual(mockEvent);
    });
  });

  describe('remove', () => {
    it('should remove event', async () => {
      mockEventService.remove.mockResolvedValue(mockEvent);

      const result = await controller.remove({
        id: '507f1f77bcf86cd799439011',
      });

      expect(service.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockEvent);
    });
  });
});
