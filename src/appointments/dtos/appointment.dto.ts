import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { APPOINTMENT_STATUS } from 'src/contants';
import { ServiceDTO } from 'src/services/dtos/service.dto';

import { ServicePeriodDTO } from '../../services/dtos/service-period.dto';

export class AppointmentDTO {
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
  })
  id: string;

  @Exclude()
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

  @ApiProperty({ type: ServicePeriodDTO })
  servicePeriods: ServicePeriodDTO;

  @ApiProperty({ type: ServiceDTO })
  service: ServiceDTO;

  @ApiProperty({
    example: {
      id: '00000000-0000-0000-0000-000000000000',
      name: APPOINTMENT_STATUS.PENDING,
      createdAt: '2021-02-12T19:16:03.971Z',
      updatedAt: '2021-02-12T19:16:03.971Z',
    },
  })
  appointmentStatus: any;

  constructor(partial: Partial<AppointmentDTO>) {
    Object.assign(this, partial);
  }
}
