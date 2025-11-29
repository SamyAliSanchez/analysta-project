import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseEnumPipe,
  Optional,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { OpenPositionDto } from './dto/open-position.dto';
import { ClosePositionDto } from './dto/close-position.dto';

interface CurrentUserData {
  userId: string;
  email: string;
  displayName: string;
}

@Controller('positions')
@UseGuards(JwtAuthGuard)
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  async openPosition(
    @CurrentUser() user: CurrentUserData,
    @Body() openPositionDto: OpenPositionDto,
  ) {
    return this.positionsService.openPosition(user.userId, openPositionDto);
  }

  @Post(':id/close')
  async closePosition(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() closePositionDto: ClosePositionDto,
  ) {
    return this.positionsService.closePosition(
      id,
      user.userId,
      closePositionDto,
    );
  }

  @Get()
  async getPositions(
    @CurrentUser() user: CurrentUserData,
    @Optional()
    @Query('status', new ParseEnumPipe(['open', 'closed'], { optional: true }))
    status?: 'open' | 'closed',
  ) {
    return this.positionsService.getPositionsByUser(user.userId, status);
  }

  @Get('summary')
  async getSummary(@CurrentUser() user: CurrentUserData) {
    return this.positionsService.getPositionSummary(user.userId);
  }

  @Get(':id')
  async getPositionById(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.positionsService.getPositionById(id, user.userId);
  }
}
