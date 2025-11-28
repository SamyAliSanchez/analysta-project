import {
  IsString,
  IsEnum,
  IsNumber,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';
import type { AssetCategory } from '../../database/schemas/asset.schema';

export class CreateAssetDto {
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  symbol!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsEnum(['equity', 'bond', 'derivative', 'crypto-like', 'exotic'])
  category!: AssetCategory;

  @IsNumber()
  @Min(0)
  @Max(1)
  volatility!: number;

  @IsString()
  @MinLength(10)
  description!: string;
}
