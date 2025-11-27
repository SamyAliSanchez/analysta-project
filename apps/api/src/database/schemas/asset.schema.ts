import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AssetDocument = HydratedDocument<Asset>;

export type AssetCategory =
  | 'equity'
  | 'bond'
  | 'derivative'
  | 'crypto-like'
  | 'exotic';

@Schema({ timestamps: true })
export class Asset {
  @Prop({ required: true, unique: true, uppercase: true })
  symbol!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({
    required: true,
    enum: ['equity', 'bond', 'derivative', 'crypto-like', 'exotic'],
  })
  category!: AssetCategory;

  @Prop({ required: true, min: 0, max: 1 })
  volatility!: number;

  @Prop({ required: true })
  description!: string;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
