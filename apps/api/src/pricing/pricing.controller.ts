import { Controller, Get, Param } from '@nestjs/common';
import { PricingService, PriceSnapshot } from './pricing.service';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get()
  getLatestPrices(): PriceSnapshot[] {
    return this.pricingService.getLatestPrices();
  }

  @Get(':identifier')
  getPriceByIdentifier(@Param('identifier') identifier: string) {
    return this.pricingService.getLatestPriceForAsset(identifier);
  }
}
