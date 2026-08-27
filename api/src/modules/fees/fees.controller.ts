import { Controller, Get, Query } from '@nestjs/common';
import { IsPublic } from '../../shared/decorators/is-public.decorator';
import { ListFeesDto } from './dto/list-fees.dto';
import { FeesService } from './fees.service';

@Controller('fees')
export class FeesController {
  constructor(private readonly service: FeesService) {}

  @IsPublic()
  @Get()
  listFees(@Query() query: ListFeesDto) {
    return this.service.getFees(query);
  }
}
