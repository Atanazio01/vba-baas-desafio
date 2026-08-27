import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ActiveUserId } from '../../shared/decorators/active-user-id.decorator';
import { IsPublic } from '../../shared/decorators/is-public.decorator';
import { CheckoutLinksService } from './checkout-links.service';
import { CreateCardCheckoutDto } from './dto/create-card-checkout.dto';
import { CreatePixCheckoutDto } from './dto/create-pix-checkout.dto';

@Controller('checkout-links')
export class CheckoutLinksController {
  constructor(private readonly service: CheckoutLinksService) {}

  @Post('pix')
  createPix(@ActiveUserId() userId: string, @Body() dto: CreatePixCheckoutDto) {
    return this.service.createPix(userId, dto);
  }

  @Post('card')
  createCard(
    @ActiveUserId() userId: string,
    @Body() dto: CreateCardCheckoutDto,
  ) {
    return this.service.createCard(userId, dto);
  }

  @IsPublic()
  @Get(':publicId')
  async getPublic(@Param('publicId') publicId: string) {
    const link = await this.service.findByPublicId(publicId);
    if (!link) {
      throw new NotFoundException('Checkout link not found');
    }
    return link;
  }
}
