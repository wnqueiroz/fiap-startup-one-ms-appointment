import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDTO {
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

  constructor(partial: Partial<CreateAppointmentDTO>) {
    Object.assign(this, partial);
  }
}
