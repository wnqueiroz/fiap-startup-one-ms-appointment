import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentEntity } from 'src/appointments/appointment.entity';
import { ServicePeriodsEntity } from './service-periods.entity';
import { ServiceEntity } from './service.entity';
import { RefOneParams } from 'src/utils/validation';

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
