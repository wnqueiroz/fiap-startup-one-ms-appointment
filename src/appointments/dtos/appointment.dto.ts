import { ApiProperty } from '@nestjs/swagger';

export class AppointmentDTO {
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
  })
  id: string;

  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
  })
  idUser: string;

  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
  })
  idService: string;

  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
  })
  idServicePeriod: string;

  @ApiProperty({
    example: '2021-02-12T19:16:03.971Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2021-02-12T19:16:03.971Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<AppointmentDTO>) {
    Object.assign(this, partial);
  }
}
