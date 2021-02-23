import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppointmentEntity } from '../appointments/appointment.entity';
import { RefOneParams } from '../utils/validation';
import { ServicePeriodsEntity } from './service-periods.entity';
import { ServiceEntity } from './service.entity';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [
    RefOneParams,
    TypeOrmModule.forFeature([
      AppointmentEntity,
      ServiceEntity,
      ServicePeriodsEntity,
    ]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
