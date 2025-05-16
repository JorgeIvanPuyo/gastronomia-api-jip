import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DishesService } from './dishes.service';
import { Dish } from './dish.entity';
import { DishCategory } from '../common/enums/dish-category.enum';
import { NotFoundException, BadRequestException } from '@nestjs/common';

type MockRepo = Partial<Record<string, jest.Mock>>;
const createMockRepo = (): MockRepo => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('DishesService', () => {
  let service: DishesService;
  let repo: MockRepo;

  beforeEach(async () => {
    const mod: TestingModule = await Test.createTestingModule({
      providers: [
        DishesService,
        { provide: getRepositoryToken(Dish), useValue: createMockRepo() },
      ],
    }).compile();

    service = mod.get(DishesService);
    repo = mod.get(getRepositoryToken(Dish));
  });

  describe('create', () => {
    it('should create a dish', async () => {
      const dto = {
        name: 'P',
        description: 'D',
        price: 10,
        category: DishCategory.APPETIZER,
      };
      repo.create.mockReturnValue(dto);
      repo.save.mockResolvedValue({ ...dto, id: '1' });
      const res = await service.create(dto);
      expect(res).toEqual({ ...dto, id: '1' });
    });

    it('should throw on invalid category', async () => {
      await expect(
        service.create({
          name: 'X',
          description: 'D',
          price: 5,
          category: 'bad',
        } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('returns a dish', async () => {
      const dish = {
        id: '1',
        name: 'P',
        description: 'D',
        price: 10,
        category: DishCategory.BEVERAGE,
      };
      repo.findOne.mockResolvedValue(dish);
      expect(await service.findOne('1')).toEqual(dish);
    });

    it('throws if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates and returns', async () => {
      const dto = { price: 20 };
      repo.update.mockResolvedValue({ affected: 1 });
      const updated = {
        id: '1',
        name: 'P',
        description: 'D',
        price: 20,
        category: DishCategory.APPETIZER,
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(updated as any);
      expect(await service.update('1', dto)).toEqual(updated);
    });

    it('throws on negative price', async () => {
      await expect(service.update('1', { price: -5 })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('deletes without error', async () => {
      repo.delete.mockResolvedValue({ affected: 1 });
      await expect(service.remove('1')).resolves.toBeUndefined();
    });

    it('throws if not found', async () => {
      repo.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
