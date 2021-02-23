import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601 } from 'class-validator';

export class CreateAppointmentDTO {
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
  })
  idService: string;

  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
  })
  idServicePeriod: string;

  @ApiProperty({
    example: '2021-02-22',
  })
  @IsISO8601(
    {},
    {
      message: 'Informe uma data no formato YYYY-MM-DD',
    },
  )
  date: string;

  constructor(partial: Partial<CreateAppointmentDTO>) {
    Object.assign(this, partial);
  }
}
