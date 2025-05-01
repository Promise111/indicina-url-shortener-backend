import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({ required: true, nullable: false })
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;
}
