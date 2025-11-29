import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Position,
  PositionDocument,
  PositionStatus,
} from '../database/schemas/position.schema';
import { AssetDocument } from '../database/schemas/asset.schema';
import { PricingService } from '../pricing/pricing.service';
import { OpenPositionDto } from './dto/open-position.dto';
import { ClosePositionDto } from './dto/close-position.dto';

export interface PositionSummary {
  totalPnL: number;
  pnLByAsset: Record<string, number>;
  openPositions: number;
  closedPositions: number;
}

@Injectable()
export class PositionsService {
  constructor(
    @InjectModel(Position.name)
    private positionModel: Model<PositionDocument>,
    private pricingService: PricingService,
  ) {}

  async openPosition(
    userId: string,
    openPositionDto: OpenPositionDto,
  ): Promise<PositionDocument> {
    // Obtener precio actual del activo
    const priceSnapshot = await this.pricingService.getLatestPriceForAsset(
      openPositionDto.assetId,
    );

    const position = new this.positionModel({
      userId: new Types.ObjectId(userId),
      assetId: new Types.ObjectId(openPositionDto.assetId),
      side: openPositionDto.side,
      quantity: openPositionDto.quantity,
      openPrice: priceSnapshot.price,
      openDate: new Date(),
      status: 'open',
    });

    return position.save();
  }

  async closePosition(
    positionId: string,
    userId: string,
    closePositionDto: ClosePositionDto,
  ): Promise<PositionDocument> {
    const position = await this.positionModel
      .findOne({
        _id: positionId,
        userId: new Types.ObjectId(userId),
        status: 'open',
      })
      .exec();

    if (!position) {
      throw new NotFoundException(
        'Posición no encontrada o ya está cerrada',
      );
    }

    position.status = 'closed';
    position.closePrice = closePositionDto.closePrice;
    position.closeDate = new Date();

    return position.save();
  }

  async getPositionsByUser(
    userId: string,
    status?: PositionStatus,
  ): Promise<PositionDocument[]> {
    const query: any = { userId: new Types.ObjectId(userId) };
    if (status) {
      query.status = status;
    }

    return this.positionModel
      .find(query)
      .populate('assetId')
      .sort({ openDate: -1 })
      .exec();
  }

  async getPositionById(
    positionId: string,
    userId: string,
  ): Promise<PositionDocument> {
    const position = await this.positionModel
      .findOne({
        _id: positionId,
        userId: new Types.ObjectId(userId),
      })
      .populate('assetId')
      .exec();

    if (!position) {
      throw new NotFoundException('Posición no encontrada');
    }

    return position;
  }

  calculatePnL(position: PositionDocument, currentPrice?: number): number {
    if (position.status === 'open' && currentPrice !== undefined) {
      // PnL no realizado para posiciones abiertas
      if (position.side === 'buy') {
        return (currentPrice - position.openPrice) * position.quantity;
      } else {
        // sell
        return (position.openPrice - currentPrice) * position.quantity;
      }
    }

    if (position.status === 'closed' && position.closePrice) {
      // PnL realizado para posiciones cerradas
      if (position.side === 'buy') {
        return (position.closePrice - position.openPrice) * position.quantity;
      } else {
        // sell
        return (position.openPrice - position.closePrice) * position.quantity;
      }
    }

    return 0;
  }

  async getPositionSummary(userId: string): Promise<PositionSummary> {
    const positions = await this.getPositionsByUser(userId);

    const summary: PositionSummary = {
      totalPnL: 0,
      pnLByAsset: {},
      openPositions: 0,
      closedPositions: 0,
    };

    for (const position of positions) {
      if (position.status === 'open') {
        summary.openPositions++;
      } else {
        summary.closedPositions++;
        const pnl = this.calculatePnL(position);
        summary.totalPnL += pnl;

        const assetId = position.assetId.toString();
        if (!summary.pnLByAsset[assetId]) {
          summary.pnLByAsset[assetId] = 0;
        }
        summary.pnLByAsset[assetId] += pnl;
      }
    }

    return summary;
  }
}
