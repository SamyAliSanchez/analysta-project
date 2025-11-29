import { Controller, Get, Param, Query } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { FilterAssetsDto } from './dto/filter-assets.dto';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  async findAll(@Query() filters: FilterAssetsDto) {
    return this.assetsService.findAll(filters);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.assetsService.findById(id);
  }
}
