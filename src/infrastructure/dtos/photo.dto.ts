import { ApiProperty } from '@nestjs/swagger';
import { AlbumDto } from './album.dto';

export class PhotoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  thumbnailUrl: string;

  @ApiProperty({ type: AlbumDto })
  album: AlbumDto;
}
