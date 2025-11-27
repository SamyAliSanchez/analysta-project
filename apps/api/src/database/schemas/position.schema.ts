import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PositionDocument = HydratedDocument<Position>;

export type PositionSide = 'buy' | 'sell';
export type PositionStatus = 'open' | 'closed';

@Schema({ timestamps: true })
export class Position {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Asset', required: true, index: true })
  assetId!: Types.ObjectId;

  @Prop({ required: true, enum: ['buy', 'sell'] })
  side!: PositionSide;

  @Prop({ required: true, min: 0.01 })
  quantity!: number;

  @Prop({ required: true, min: 0 })
  openPrice!: number;

  @Prop({ required: true, default: () => new Date() })
  openDate!: Date;

  @Prop({
    required: true,
    enum: ['open', 'closed'],
    default: 'open',
    index: true,
  })
  status!: PositionStatus;

  @Prop({ min: 0 })
  closePrice?: number;

  @Prop()
  closeDate?: Date;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
