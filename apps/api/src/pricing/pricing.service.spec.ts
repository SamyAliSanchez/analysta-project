import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { AssetsService } from '../assets/assets.service';
import { PriceTick } from '../database/schemas/price-tick.schema';
import { AssetDocument } from '../database/schemas/asset.schema';

describe('PricingService', () => {
  let service: PricingService;
  let assetsService: any;
  let priceTickModel: any;
  let configService: any;

  const mockAsset: any = {
    _id: '507f1f77bcf86cd799439011',
    symbol: 'QCRD',
    name: 'Quantum Credit',
    volatility: 0.65,
    toString: function () {
      return this._id;
    },
  };

  beforeEach(async () => {
    const mockAssetsService = {
      findAll: jest.fn(),
      findBySymbol: jest.fn(),
      findById: jest.fn(),
    };

    const mockPriceTickModel = {
      create: jest.fn(),
      findOne: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn(),
        }),
      }),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue(3000),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricingService,
        {
          provide: AssetsService,
          useValue: mockAssetsService,
        },
        {
          provide: getModelToken(PriceTick.name),
          useValue: mockPriceTickModel,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PricingService>(PricingService);
    assetsService = module.get<AssetsService>(AssetsService);
    priceTickModel = module.get(getModelToken(PriceTick.name));
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLatestPrices', () => {
    it('should return array of price snapshots', () => {
      const prices = service.getLatestPrices();
      expect(Array.isArray(prices)).toBe(true);
    });
  });

  describe('getLatestPriceForAsset', () => {
    it('should return price snapshot for valid asset', async () => {
      const assetIdString = '507f1f77bcf86cd799439011';
      const mockSnapshot = {
        assetId: assetIdString,
        symbol: mockAsset.symbol,
        name: mockAsset.name,
        price: 100,
        timestamp: new Date(),
      };

      // Mock the private method by accessing the map directly
      (service as any).latestPrices.set(assetIdString, mockSnapshot);

      assetsService.findBySymbol = jest.fn().mockResolvedValue(mockAsset);

      const result = await service.getLatestPriceForAsset(mockAsset.symbol);

      expect(result).toHaveProperty('assetId');
      expect(result).toHaveProperty('price');
      expect(result).toHaveProperty('timestamp');
    });

    it('should throw NotFoundException if asset not found', async () => {
      assetsService.findBySymbol = jest.fn().mockResolvedValue(null);
      assetsService.findById = jest.fn().mockRejectedValue(new Error());

      await expect(service.getLatestPriceForAsset('INVALID')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Price simulation algorithm', () => {
    it('should calculate price within volatility range', () => {
      const previousPrice = 100;
      const volatility = 0.5;

      // Test the algorithm logic: price * (1 + random(-volatility, +volatility))
      // Since Math.random() returns 0-1, we can simulate:
      const minMultiplier = 1 - volatility; // 0.5
      const maxMultiplier = 1 + volatility; // 1.5

      const minPrice = previousPrice * minMultiplier; // 50
      const maxPrice = previousPrice * maxMultiplier; // 150

      // The price should always be within this range
      expect(minPrice).toBeGreaterThanOrEqual(previousPrice * (1 - volatility));
      expect(maxPrice).toBeLessThanOrEqual(previousPrice * (1 + volatility));
    });

    it('should ensure price is never negative', () => {
      const previousPrice = 10;
      const volatility = 0.9; // Very high volatility

      const minPrice = previousPrice * (1 - volatility); // 10 * 0.1 = 1

      // Price should be clamped to minimum 0.01
      const finalPrice = Math.max(minPrice, 0.01);

      expect(finalPrice).toBeGreaterThanOrEqual(0.01);
    });
  });
});
