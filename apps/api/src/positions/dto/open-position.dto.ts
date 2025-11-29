import { IsString, IsEnum, IsNumber, Min } from 'class-validator';

export class OpenPositionDto {
  @IsString()
  assetId!: string;

  @IsEnum(['buy', 'sell'])
  side!: 'buy' | 'sell';

  @IsNumber()
  @Min(0.01)
  quantity!: number;
}
