import { ApiProperty } from '@nestjs/swagger';

export class GeoDto {
  @ApiProperty()
  lat: string;

  @ApiProperty()
  lng: string;
}

export class AddressDto {
  @ApiProperty()
  street: string;

  @ApiProperty()
  suite: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  zipcode: string;

  @ApiProperty({ type: GeoDto })
  geo: GeoDto;
}

export class CompanyDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  catchPhrase: string;

  @ApiProperty()
  bs: string;
}

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: AddressDto })
  address: AddressDto;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  website: string;

  @ApiProperty({ type: CompanyDto })
  company: CompanyDto;
}
