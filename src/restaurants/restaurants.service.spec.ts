import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './restaurant.entity';
import { CuisineType } from '../common/enums/cuisine-type.enum';
import { NotFoundException, BadRequestException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepo = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('RestaurantsService', () => {
  let service: RestaurantsService;
  let repo: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: getRepositoryToken(Restaurant),
          useValue: createMockRepo(),
        },
      ],
    }).compile();

    service = module.get(RestaurantsService);
    repo = module.get(getRepositoryToken(Restaurant));
  });

  describe('findAll', () => {
    it('should return array of restaurants', async () => {
      const items = [{ id: '1', name: 'A', dishes: [] }];
      repo.find.mockResolvedValue(items);
      expect(await service.findAll()).toEqual(items);
    });
  });

  describe('findOne', () => {
    it('should return a restaurant', async () => {
      const item = { id: '1', name: 'A', dishes: [] };
      repo.findOne.mockResolvedValue(item);
      expect(await service.findOne('1')).toEqual(item);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return restaurant', async () => {
      const dto = {
        name: 'A',
        address: 'X',
        cuisineType: CuisineType.ITALIAN,
        website: 'http://x.com',
      };
      repo.create.mockReturnValue(dto);
      repo.save.mockResolvedValue({ ...dto, id: '1' });
      const result = await service.create(dto);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual({ ...dto, id: '1' });
    });

    it('should throw on invalid cuisine', async () => {
      const dto = {
        name: 'A',
        address: 'X',
        cuisineType: 'invalid',
        website: 'http://x.com',
      };
      await expect(service.create(dto as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update and return restaurant', async () => {
      const dto = { cuisineType: CuisineType.MEXICAN };
      repo.update.mockResolvedValue({ affected: 1 });
      const updated = {
        id: '1',
        name: 'A',
        address: 'X',
        cuisineType: CuisineType.MEXICAN,
        dishes: [],
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(updated as any);
      expect(await service.update('1', dto)).toEqual(updated);
    });

    it('should throw on invalid cuisine', async () => {
      await expect(
        service.update('1', { cuisineType: 'bad' } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete without error', async () => {
      repo.delete.mockResolvedValue({ affected: 1 });
      await expect(service.remove('1')).resolves.toBeUndefined();
    });

    it('should throw if id not found', async () => {
      repo.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
