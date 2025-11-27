import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Asset, AssetSchema } from './schemas/asset.schema';
import { Position, PositionSchema } from './schemas/position.schema';
import { PriceTick, PriceTickSchema } from './schemas/price-tick.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Asset.name, schema: AssetSchema },
      { name: Position.name, schema: PositionSchema },
      { name: PriceTick.name, schema: PriceTickSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
