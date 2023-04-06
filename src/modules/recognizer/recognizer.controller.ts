import { Body, Controller, Header, Post, Req, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/commons/guards/accessToken.guard';
import { RecognizerService } from './recognizer.service';

@Controller('recognizer')
export class RecognizerController {
  constructor(private readonly recognizerService: RecognizerService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @Header('Cache-Control', 'none')
  create(
    @Body()
    createRecognizerDto: Pick<
      Prisma.RecognizerCreateInput,
      'device_id' | 'device_ip'
    >,
    @Req() req: any,
  ) {
    return this.recognizerService.create(createRecognizerDto, req.user.id);
  }

  @Post('check')
  @Header('Cache-Control', 'none')
  check(
    @Body()
    checkClientDto: any,
  ) {
    console.log(checkClientDto);

    return this.recognizerService.check(checkClientDto);
  }
}
