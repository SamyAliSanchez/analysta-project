import { IsNumber, Min } from 'class-validator';

export class ClosePositionDto {
  @IsNumber()
  @Min(0)
  closePrice!: number;
}
