import { ServicesModule } from './services/services.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ServicesModule,
    AppointmentsModule,
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig],
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
    }),
  ],
})
export class AppModule {}
