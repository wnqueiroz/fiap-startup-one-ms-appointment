import { ApiProperty } from '@nestjs/swagger';

import { ServicePeriodDTO } from './service-period.dto';

export class ServiceDTO {
  @ApiProperty({
    example: '3f0a66e5-3886-4f22-9cb1-41c921e62e20',
  })
  id: string;

  @ApiProperty({
    example: 'Cortar Cabelo',
  })
  name: string;

  @ApiProperty({
    example: '3f0a66e5-3886-4f22-9cb1-41c921e62e20',
  })
  idCompany: string;

  @ApiProperty({
    example: '2021-02-12T19:16:03.971Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2021-02-12T19:16:03.971Z',
  })
  updatedAt: Date;

  @ApiProperty({ type: [ServicePeriodDTO] })
  servicePeriods: ServicePeriodDTO[];

  constructor(partial: Partial<ServiceDTO>) {
    Object.assign(this, partial);
  }
}
