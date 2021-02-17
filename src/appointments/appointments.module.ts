import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { AppointmentEntity } from './appointment.entity';
import { RefOneParams } from 'src/utils/validation';
import { AuthModule } from 'src/auth/auth.module';
import { ClientOptions, ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_CLIENTS } from 'src/contants';
import { ConfigService } from '@nestjs/config';

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
