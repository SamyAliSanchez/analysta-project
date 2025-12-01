import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { isValidObjectId, Model } from 'mongoose';
import { AssetsService } from '../assets/assets.service';
import { AssetDocument } from '../database/schemas/asset.schema';
import {
  PriceTick,
  PriceTickDocument,
} from '../database/schemas/price-tick.schema';

export type PriceSnapshot = {
  assetId: string;
  symbol: string;
  name: string;
  price: number;
  timestamp: Date;
};

@Injectable()
export class PricingService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PricingService.name);
  private readonly priceTickerIntervalMs: number;
  private readonly latestPrices = new Map<string, PriceSnapshot>();
  private tickerHandle?: NodeJS.Timeout;

  constructor(
    private readonly assetsService: AssetsService,
    private readonly configService: ConfigService,
    @InjectModel(PriceTick.name)
    private readonly priceTickModel: Model<PriceTickDocument>,
  ) {
    this.priceTickerIntervalMs =
      this.configService.get<number>('app.priceTickIntervalMs', {
        infer: true,
      }) ?? 3000;
  }

  async onModuleInit() {
    await this.bootstrapPrices();
    this.tickerHandle = setInterval(
      () => void this.generateNextPrices(),
      this.priceTickerIntervalMs,
    );
    this.logger.log(
      `Pricing simulator started (interval ${this.priceTickerIntervalMs}ms)`,
    );
  }

  onModuleDestroy() {
    if (this.tickerHandle) {
      clearInterval(this.tickerHandle);
    }
  }

  getLatestPrices(): PriceSnapshot[] {
    return Array.from(this.latestPrices.values());
  }

  async getLatestPriceForAsset(identifier: string): Promise<PriceSnapshot> {
    const asset = await this.resolveAsset(identifier);
    const key = asset._id.toString();

    const snapshot = this.latestPrices.get(key);
    if (snapshot) {
      return snapshot;
    }

    const fallbackSnapshot = await this.createSnapshotFromLastTick(asset);
    if (fallbackSnapshot) {
      this.latestPrices.set(key, fallbackSnapshot);
      return fallbackSnapshot;
    }

    throw new NotFoundException(
      `No price data available for asset ${asset.symbol}`,
    );
  }

  private async bootstrapPrices() {
    const assets = await this.assetsService.findAll();
    await Promise.all(
      assets.map(async (asset) => {
        const snapshot =
          (await this.createSnapshotFromLastTick(asset)) ??
          (await this.createInitialSnapshot(asset));
        this.latestPrices.set(asset._id.toString(), snapshot);
      }),
    );
  }

  private async generateNextPrices() {
    await this.cleanupOldPriceTicks();

    const assets = await this.assetsService.findAll();
    await Promise.all(
      assets.map(async (asset) => {
        const key = asset._id.toString();
        let previous =
          this.latestPrices.get(key) ??
          (await this.createSnapshotFromLastTick(asset)) ??
          (await this.createInitialSnapshot(asset));

        if (previous.price < 10) {
          previous = await this.createInitialSnapshot(asset);
        }

        const tickVolatility = asset.volatility * 0.05;
        const change = (Math.random() * 2 - 1) * tickVolatility;
        const multiplier = 1 + change;
        const rawPrice = previous.price * multiplier;
        const minPriceForTick = previous.price * 0.97;
        const absoluteMinPrice = Math.max(10.0, previous.price * 0.1);
        const price = Number(
          Math.max(
            rawPrice,
            Math.max(minPriceForTick, absoluteMinPrice),
          ).toFixed(2),
        );
        const timestamp = new Date();

        const snapshot: PriceSnapshot = {
          assetId: key,
          symbol: asset.symbol,
          name: asset.name,
          price,
          timestamp,
        };

        this.latestPrices.set(key, snapshot);
        await this.priceTickModel.create({
          assetId: asset._id,
          price,
          timestamp,
        });
      }),
    );
  }

  private async createSnapshotFromLastTick(
    asset: AssetDocument,
  ): Promise<PriceSnapshot | null> {
    const lastTick = await this.priceTickModel
      .findOne({ assetId: asset._id })
      .sort({ timestamp: -1 })
      .exec();

    if (!lastTick) {
      return null;
    }

    if (lastTick.price < 10) {
      return null;
    }

    return {
      assetId: asset._id.toString(),
      symbol: asset.symbol,
      name: asset.name,
      price: Number(lastTick.price.toFixed(2)),
      timestamp: lastTick.timestamp,
    };
  }

  private async createInitialSnapshot(
    asset: AssetDocument,
  ): Promise<PriceSnapshot> {
    const basePrices: Record<string, number> = {
      QCRD: 150,
      PHBN: 100,
      DRKM: 200,
      NBLX: 120,
    };

    const basePrice = basePrices[asset.symbol] || 100;
    const price = Number((basePrice * (0.9 + Math.random() * 0.2)).toFixed(2));
    const timestamp = new Date();

    await this.priceTickModel.create({
      assetId: asset._id,
      price,
      timestamp,
    });

    return {
      assetId: asset._id.toString(),
      symbol: asset.symbol,
      name: asset.name,
      price,
      timestamp,
    };
  }

  private async resolveAsset(identifier: string): Promise<AssetDocument> {
    const assetBySymbol = await this.assetsService.findBySymbol(
      identifier.toUpperCase(),
    );
    if (assetBySymbol) {
      return assetBySymbol;
    }

    if (isValidObjectId(identifier)) {
      try {
        return await this.assetsService.findById(identifier);
      } catch (error) {}
    }

    throw new NotFoundException(`Asset ${identifier} not found`);
  }

  private async cleanupOldPriceTicks(): Promise<void> {
    try {
      const totalTicks = await this.priceTickModel.countDocuments().exec();

      if (totalTicks >= 2000) {
        this.logger.log(
          `Cleaning up price ticks: ${totalTicks} records found, deleting all...`,
        );
        await this.priceTickModel.deleteMany({}).exec();
        this.logger.log('All price ticks deleted. Starting fresh...');
      }
    } catch (error) {
      this.logger.error('Error cleaning up price ticks:', error);
    }
  }
}
