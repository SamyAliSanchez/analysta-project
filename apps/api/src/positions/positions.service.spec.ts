import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PricingService } from '../pricing/pricing.service';
import {
  Position,
  PositionDocument,
} from '../database/schemas/position.schema';

describe('PositionsService', () => {
  let service: PositionsService;
  let positionModel: any;
  let pricingService: any;

  const mockPosition = {
    _id: '507f1f77bcf86cd799439011',
    userId: '507f1f77bcf86cd799439012',
    assetId: '507f1f77bcf86cd799439013',
    side: 'buy' as const,
    quantity: 10,
    openPrice: 100,
    openDate: new Date(),
    status: 'open' as const,
    save: jest.fn().mockResolvedValue(true),
    populate: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const mockPositionModel: any = function (this: any, data: any) {
      Object.assign(this, data);
      this.save = jest.fn().mockResolvedValue(this);
      return this;
    };
    mockPositionModel.findOne = jest.fn();
    mockPositionModel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    });

    const mockPricingService = {
      getLatestPriceForAsset: jest.fn().mockResolvedValue({
        assetId: '507f1f77bcf86cd799439013',
        price: 100,
        timestamp: new Date(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositionsService,
        {
          provide: getModelToken(Position.name),
          useValue: mockPositionModel,
        },
        {
          provide: PricingService,
          useValue: mockPricingService,
        },
      ],
    }).compile();

    service = module.get<PositionsService>(PositionsService);
    positionModel = module.get(getModelToken(Position.name));
    pricingService = module.get<PricingService>(PricingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calculatePnL', () => {
    it('should calculate PnL correctly for buy position (open)', () => {
      const position = {
        ...mockPosition,
        side: 'buy' as const,
        openPrice: 100,
        quantity: 10,
        status: 'open' as const,
      } as unknown as PositionDocument;

      const currentPrice = 110;
      const pnl = service.calculatePnL(position, currentPrice);

      // (110 - 100) * 10 = 100
      expect(pnl).toBe(100);
    });

    it('should calculate PnL correctly for sell position (open)', () => {
      const position = {
        ...mockPosition,
        side: 'sell' as const,
        openPrice: 100,
        quantity: 10,
        status: 'open' as const,
      } as unknown as PositionDocument;

      const currentPrice = 90;
      const pnl = service.calculatePnL(position, currentPrice);

      // (100 - 90) * 10 = 100
      expect(pnl).toBe(100);
    });

    it('should calculate PnL correctly for buy position (closed)', () => {
      const position = {
        ...mockPosition,
        side: 'buy' as const,
        openPrice: 100,
        closePrice: 110,
        quantity: 10,
        status: 'closed' as const,
      } as unknown as PositionDocument;

      const pnl = service.calculatePnL(position);

      // (110 - 100) * 10 = 100
      expect(pnl).toBe(100);
    });

    it('should calculate PnL correctly for sell position (closed)', () => {
      const position = {
        ...mockPosition,
        side: 'sell' as const,
        openPrice: 100,
        closePrice: 90,
        quantity: 10,
        status: 'closed' as const,
      } as unknown as PositionDocument;

      const pnl = service.calculatePnL(position);

      // (100 - 90) * 10 = 100
      expect(pnl).toBe(100);
    });

    it('should return 0 for open position without current price', () => {
      const position = {
        ...mockPosition,
        status: 'open' as const,
      } as unknown as PositionDocument;

      const pnl = service.calculatePnL(position);
      expect(pnl).toBe(0);
    });
  });

  describe('openPosition', () => {
    it('should open a new position', async () => {
      const openPositionDto = {
        assetId: '507f1f77bcf86cd799439013',
        side: 'buy' as const,
        quantity: 10,
      };

      const userId = '507f1f77bcf86cd799439012';

      const result = await service.openPosition(userId, openPositionDto);

      expect(pricingService.getLatestPriceForAsset).toHaveBeenCalledWith(
        openPositionDto.assetId,
      );
      expect(result).toBeDefined();
      expect(result.save).toHaveBeenCalled();
    });
  });

  describe('closePosition', () => {
    it('should close an open position', async () => {
      const positionToClose = {
        ...mockPosition,
        status: 'open' as const,
        save: jest.fn().mockResolvedValue({
          ...mockPosition,
          status: 'closed',
          closePrice: 110,
          closeDate: new Date(),
        }),
      };

      positionModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(positionToClose),
      });

      const closePositionDto = { closePrice: 110 };
      const userId = '507f1f77bcf86cd799439012';
      const positionId = '507f1f77bcf86cd799439011';

      await service.closePosition(positionId, userId, closePositionDto);

      expect(positionModel.findOne).toHaveBeenCalled();
      expect(positionToClose.status).toBe('closed');
      expect((positionToClose as any).closePrice).toBe(110);
      expect(positionToClose.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if position not found', async () => {
      positionModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const closePositionDto = { closePrice: 110 };
      const userId = '507f1f77bcf86cd799439012';
      const positionId = '507f1f77bcf86cd799439011';

      await expect(
        service.closePosition(positionId, userId, closePositionDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPositionById', () => {
    it('should return position by id', async () => {
      const foundPosition = {
        ...mockPosition,
        populate: jest.fn().mockReturnThis(),
      };

      positionModel.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(foundPosition),
        }),
      });

      const userId = '507f1f77bcf86cd799439012';
      const positionId = '507f1f77bcf86cd799439011';

      const result = await service.getPositionById(positionId, userId);

      expect(result).toEqual(foundPosition);
    });

    it('should throw NotFoundException if position not found', async () => {
      positionModel.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      const userId = '507f1f77bcf86cd799439012';
      const positionId = '507f1f77bcf86cd799439011';

      await expect(service.getPositionById(positionId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
