import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RestaurantDishesService } from './restaurant-dishes.service';
import { Restaurant } from './restaurant.entity';
import { Dish } from '../dishes/dish.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

type MockRepo = Partial<Record<string, jest.Mock>>;
const createMockRepo = (): MockRepo => ({
  findOne: jest.fn(),
  save: jest.fn(),
  findByIds: jest.fn(),
  findOneBy: jest.fn(),
});

describe('RestaurantDishesService', () => {
  let service: RestaurantDishesService;
  let restRepo: MockRepo;
  let dishRepo: MockRepo;

  beforeEach(async () => {
    const mod: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantDishesService,
        { provide: getRepositoryToken(Restaurant), useValue: createMockRepo() },
        { provide: getRepositoryToken(Dish), useValue: createMockRepo() },
      ],
    }).compile();

    service = mod.get(RestaurantDishesService);
    restRepo = mod.get(getRepositoryToken(Restaurant));
    dishRepo = mod.get(getRepositoryToken(Dish));
  });

  describe('addDishToRestaurant', () => {
    it('adds a dish', async () => {
      const rest = { id: 'r1', dishes: [] };
      const dish = { id: 'd1' };
      restRepo.findOne.mockResolvedValue(rest);
      dishRepo.findOneBy.mockResolvedValue(dish);
      restRepo.save.mockResolvedValue({ ...rest, dishes: [dish] });
      const result = await service.addDishToRestaurant('r1', 'd1');
      expect(result.dishes).toContain(dish);
    });

    it('throws if restaurant not found', async () => {
      restRepo.findOne.mockResolvedValue(null);
      await expect(service.addDishToRestaurant('r1', 'd1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws if dish not found', async () => {
      restRepo.findOne.mockResolvedValue({ id: 'r1', dishes: [] });
      dishRepo.findOneBy.mockResolvedValue(null);
      await expect(service.addDishToRestaurant('r1', 'd1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws on duplicate', async () => {
      const r = { id: 'r1', dishes: [{ id: 'd1' }] };
      restRepo.findOne.mockResolvedValue(r);
      dishRepo.findOneBy.mockResolvedValue({ id: 'd1' });
      await expect(service.addDishToRestaurant('r1', 'd1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findDishesFromRestaurant', () => {
    it('returns dishes array', async () => {
      const r = { id: 'r1', dishes: [{ id: 'd1' }] };
      restRepo.findOne.mockResolvedValue(r);
      expect(await service.findDishesFromRestaurant('r1')).toEqual(r.dishes);
    });

    it('throws if restaurant not found', async () => {
      restRepo.findOne.mockResolvedValue(null);
      await expect(service.findDishesFromRestaurant('r1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findDishFromRestaurant', () => {
    it('returns a dish', async () => {
      jest
        .spyOn(service, 'findDishesFromRestaurant')
        .mockResolvedValue([{ id: 'd1' }] as any);
      expect(await service.findDishFromRestaurant('r1', 'd1')).toEqual({
        id: 'd1',
      });
    });
    it('throws if not associated', async () => {
      jest.spyOn(service, 'findDishesFromRestaurant').mockResolvedValue([]);
      await expect(service.findDishFromRestaurant('r1', 'd1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateDishesFromRestaurant', () => {
    it('replaces dishes list', async () => {
      const r = { id: 'r1', dishes: [] };
      restRepo.findOne.mockResolvedValue(r);
      dishRepo.findByIds.mockResolvedValue([{ id: 'd1' }]);
      restRepo.save.mockResolvedValue({ ...r, dishes: [{ id: 'd1' }] });
      const updated = await service.updateDishesFromRestaurant('r1', ['d1']);
      expect(updated).toEqual([{ id: 'd1' }]);
    });
    it('throws if some not found', async () => {
      restRepo.findOne.mockResolvedValue({ id: 'r1', dishes: [] });
      dishRepo.findByIds.mockResolvedValue([]);
      await expect(
        service.updateDishesFromRestaurant('r1', ['d1']),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteDishFromRestaurant', () => {
    it('removes dish', async () => {
      restRepo.findOne.mockResolvedValue({ id: 'r1', dishes: [{ id: 'd1' }] });
      await service.deleteDishFromRestaurant('r1', 'd1');
      expect(restRepo.save).toHaveBeenCalled();
    });
    it('throws if not associated', async () => {
      restRepo.findOne.mockResolvedValue({ id: 'r1', dishes: [] });
      await expect(
        service.deleteDishFromRestaurant('r1', 'd1'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
