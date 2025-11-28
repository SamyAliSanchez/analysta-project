import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { DatabaseModule } from '../database/database.module';
import { AssetsModule } from '../assets/assets.module';

@Module({
  imports: [DatabaseModule, AssetsModule],
  providers: [PricingService],
  controllers: [PricingController],
  exports: [PricingService],
})
export class PricingModule {}
