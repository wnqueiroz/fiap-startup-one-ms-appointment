import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { KAFKA_CLIENTS } from '../contants';
import { RefOneParams } from '../utils/validation';
import { AppointmentEntity } from './appointment.entity';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

const ServicesKafkaClient = ClientsModule.registerAsync([
  {
    name: KAFKA_CLIENTS.SERVICES_SERVICE,
    inject: [ConfigService],
    useFactory: (configService: ConfigService): ClientOptions => {
      const { kafka } = configService.get('app');

      return {
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'ms-appointment',
            brokers: [`${kafka.host}:${kafka.port}`],
          },
          consumer: {
            groupId: 'ms-appointment-consumer',
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      };
    },
  },
]);

@Module({
  imports: [
    RefOneParams,
    TypeOrmModule.forFeature([AppointmentEntity]),
    AuthModule,
    ServicesKafkaClient,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [ServicesKafkaClient, AppointmentsService],
})
export class AppointmentsModule {}
