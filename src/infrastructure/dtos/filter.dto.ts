import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterDto {
  @ApiPropertyOptional({ description: 'Filter photos title containing value' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Filter album title containing value' })
  @IsOptional()
  @IsString()
  'album.title'?: string;

  @ApiPropertyOptional({ description: 'Filter album user email equals value' })
  @IsOptional()
  @IsString()
  'album.user.email'?: string;

  @ApiPropertyOptional({ description: 'Limit number of results', default: 25 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 25;

  @ApiPropertyOptional({ description: 'Offset into the results', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
