import { IsOptional, IsString, IsEnum } from 'class-validator';
import type { AssetCategory } from '../../database/schemas/asset.schema';

export class FilterAssetsDto {
  @IsOptional()
  @IsEnum(['equity', 'bond', 'derivative', 'crypto-like', 'exotic'])
  category?: AssetCategory;

  @IsOptional()
  @IsString()
  search?: string;
}
