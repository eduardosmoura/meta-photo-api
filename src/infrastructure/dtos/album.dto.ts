import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class AlbumDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}
