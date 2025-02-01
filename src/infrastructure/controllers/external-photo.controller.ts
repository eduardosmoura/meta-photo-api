import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { MetaPhotoApiUseCase } from '../../core/use-cases/meta-photo-api.use-case';
import { PhotoDto } from '../dtos/photo.dto';
import { PhotoFilters } from 'src/core/services/meta-photo-api.service';

@ApiTags('External API')
@Controller('externalapi/photos')
export class ExternalPhotoController {
  constructor(private readonly metaPhotoApiUseCase: MetaPhotoApiUseCase) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Get Enriched Photo by ID',
    description:
      'Retrieves a single photo enriched with its album and corresponding user details.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the photo to retrieve',
  })
  @ApiResponse({
    status: 200,
    description:
      'Photo retrieved successfully and enriched with album and user details.',
    type: PhotoDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Photo, album, or user not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Photo with id 1 not found',
        timestamp: '2025-02-01T12:34:56.789Z',
        path: '/externalapi/photos/1',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        timestamp: '2025-02-01T12:34:56.789Z',
        path: '/externalapi/photos/1',
      },
    },
  })
  async getPhotoById(@Param('id', ParseIntPipe) id: number): Promise<PhotoDto> {
    const photo = await this.metaPhotoApiUseCase.getEnrichedPhotoById(id);
    return photo as PhotoDto;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Enriched Photos',
    description:
      'Retrieves a list of photos enriched with album and user details. You can apply optional filters on photo title, album title, or album user email. Pagination is supported using the limit and offset query parameters.',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'Filter photos where the title contains the provided value.',
  })
  @ApiQuery({
    name: 'album.title',
    required: false,
    description:
      'Filter photos where the album title contains the provided value.',
  })
  @ApiQuery({
    name: 'album.user.email',
    required: false,
    description:
      'Filter photos where the album user email equals the provided value.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of records to return (default is 25).',
    type: Number,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Starting position in the result set (default is 0).',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Photos retrieved successfully.',
    type: [PhotoDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No matching records found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'No photos found matching the provided filters',
        timestamp: '2025-02-01T12:34:56.789Z',
        path: '/externalapi/photos',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        timestamp: '2025-02-01T12:34:56.789Z',
        path: '/externalapi/photos',
      },
    },
  })
  async getPhotos(@Query() query: PhotoFilters): Promise<PhotoDto[]> {
    const photos = await this.metaPhotoApiUseCase.getEnrichedPhotos(query);
    return photos as PhotoDto[];
  }
}
