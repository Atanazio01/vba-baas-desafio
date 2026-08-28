import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ActiveUserId } from '../../shared/decorators/active-user-id.decorator';
import { IsPublic } from '../../shared/decorators/is-public.decorator';
import { CheckoutLinksService } from './checkout-links.service';
import { CreateCardCheckoutDto } from './dto/create-card-checkout.dto';
import { CreatePixCheckoutDto } from './dto/create-pix-checkout.dto';
import { SendCheckoutEmailDto } from './dto/send-checkout-email.dto';

@ApiTags('Checkout Links')
@Controller('checkout-links')
export class CheckoutLinksController {
  constructor(private readonly service: CheckoutLinksService) {}

  @ApiBearerAuth()
  @Post('pix')
  createPix(@ActiveUserId() userId: string, @Body() dto: CreatePixCheckoutDto) {
    return this.service.createPix(userId, dto);
  }

  @ApiBearerAuth()
  @Post('card')
  createCard(
    @ActiveUserId() userId: string,
    @Body() dto: CreateCardCheckoutDto,
  ) {
    return this.service.createCard(userId, dto);
  }

  @IsPublic()
  @ApiOperation({ summary: 'Checkout público (sem JWT)' })
  @ApiParam({ name: 'publicId', example: 'abc123def456' })
  @Get(':publicId')
  async getPublic(@Param('publicId') publicId: string) {
    const link = await this.service.findByPublicId(publicId);
    if (!link) {
      throw new NotFoundException('Checkout link not found');
    }
    return link;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Envia link de pagamento por e-mail' })
  @ApiParam({ name: 'publicId', example: 'abc123def456' })
  @Post(':publicId/send-email')
  sendEmail(
    @ActiveUserId() userId: string,
    @Param('publicId') publicId: string,
    @Body() dto: SendCheckoutEmailDto,
  ) {
    return this.service.sendCheckoutLinkEmail(userId, publicId, dto);
  }
}
