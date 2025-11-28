import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Asset,
  AssetDocument,
  AssetCategory,
} from '../database/schemas/asset.schema';
import { FilterAssetsDto } from './dto/filter-assets.dto';
import { CreateAssetDto } from './dto/create-asset.dto';

@Injectable()
export class AssetsService {
  constructor(
    @InjectModel(Asset.name) private assetModel: Model<AssetDocument>,
  ) {}

  async findAll(filters?: FilterAssetsDto): Promise<AssetDocument[]> {
    const query: any = {};

    if (filters?.category) {
      query.category = filters.category;
    }

    if (filters?.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { symbol: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return this.assetModel.find(query).sort({ symbol: 1 }).exec();
  }

  async findById(id: string): Promise<AssetDocument> {
    const asset = await this.assetModel.findById(id).exec();
    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }
    return asset;
  }

  async findBySymbol(symbol: string): Promise<AssetDocument | null> {
    return this.assetModel.findOne({ symbol: symbol.toUpperCase() }).exec();
  }

  async create(createAssetDto: CreateAssetDto): Promise<AssetDocument> {
    const asset = new this.assetModel({
      ...createAssetDto,
      symbol: createAssetDto.symbol.toUpperCase(),
    });
    return asset.save();
  }

  async createMany(assets: CreateAssetDto[]): Promise<AssetDocument[]> {
    const assetsToInsert = assets.map((asset) => ({
      ...asset,
      symbol: asset.symbol.toUpperCase(),
    }));
    return this.assetModel.insertMany(assetsToInsert);
  }

  async exists(symbol: string): Promise<boolean> {
    const count = await this.assetModel
      .countDocuments({
        symbol: symbol.toUpperCase(),
      })
      .exec();
    return count > 0;
  }
}
