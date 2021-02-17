import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { AppointmentEntity } from './appointment.entity';
import { RefOneParams } from 'src/utils/validation';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    RefOneParams,
    TypeOrmModule.forFeature([AppointmentEntity]),
    AuthModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
