import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PriceTickDocument = HydratedDocument<PriceTick>;

@Schema({ timestamps: true })
export class PriceTick {
  @Prop({ type: Types.ObjectId, ref: 'Asset', required: true, index: true })
  assetId!: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true, default: () => new Date() })
  timestamp!: Date;
}

export const PriceTickSchema = SchemaFactory.createForClass(PriceTick);
