import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response } from 'express';
import config from 'src/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('url')
@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('api/encode')
  async encode(@Body() createUrlDto: CreateUrlDto) {
    const url = await this.urlService.shortenUrl(createUrlDto);
    return {
      originalUrl: url.originalUrl.toLowerCase(),
      shortUrl: `${config.baseUrl}/${url.shortCode}`,
      shortCode: url.shortCode,
    };
  }

  @Get('api/decode')
  async decode(@Query('shortUrl') shortUrl: string) {
    const shortCode = shortUrl.split('/').pop();
    const originalUrl = await this.urlService.getOriginalUrl(shortCode);
    return { originalUrl };
  }

  @Get('api/statistic/:shortCode')
  async getStats(@Param('shortCode') shortCode: string) {
    const url = await this.urlService.getUrlStats(shortCode);
    return {
      originalUrl: url.originalUrl,
      shortUrl: `${config.baseUrl}/${url.shortCode}`,
      clickCount: url.clickCount,
      createdAt: url.createdAt,
      lastAccessed: url.updatedAt,
    };
  }

  @Get('api/list')
  async listUrls() {
    return this.urlService.findAll();
  }

  @Get('api/search')
  async searchUrls(@Query('q') query: string) {
    if (!query || query.length < 3) {
      return [];
    }
    return this.urlService.searchUrls(query);
  }

  @Get(':shortCode')
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const originalUrl = await this.urlService.getOriginalUrl(shortCode);
    if (originalUrl) {
      return res.redirect(HttpStatus.PERMANENT_REDIRECT, originalUrl);
    }
    return res.status(HttpStatus.NOT_FOUND).json({ message: 'URL not found' });
  }
}
