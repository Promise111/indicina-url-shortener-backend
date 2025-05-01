import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { Repository } from 'typeorm';
import { CreateUrlDto } from './dto';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url) private readonly urlRepository: Repository<Url>,
  ) {}

  /*
   * nanoid over shortid, because nanoid ensures id uniqueness even though shortid ensures very short ids
   */

  async shortenUrl(createUrlDto: CreateUrlDto): Promise<Url> {
    const { originalUrl } = createUrlDto;

    // Check if URL already exists
    const existingUrl = await this.urlRepository.findOne({
      where: { originalUrl },
    });
    if (existingUrl) {
      return existingUrl;
    }

    // Create new short URL
    const url = new Url();
    url.originalUrl = originalUrl;
    url.shortCode = nanoid();

    return this.urlRepository.save(url);
  }

  async getOriginalUrl(shortCode: string): Promise<string> {
    const url = await this.urlRepository.findOne({ where: { shortCode } });
    if (url) {
      url.clickCount += 1;
      await this.urlRepository.save(url);
      return url.originalUrl;
    }
    return null;
  }

  async getUrlStats(shortCode: string): Promise<Url> {
    return this.urlRepository.findOne({ where: { shortCode } });
  }

  async findAll(): Promise<Url[]> {
    return this.urlRepository.find();
  }

  async searchUrls(term: string): Promise<Url[]> {
    return this.urlRepository
      .createQueryBuilder()
      .where('originalUrl LIKE :term', { term: `%${term}%` })
      .getMany();
  }
}
