import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { GetCurrentUser } from '../auth/auth.annotation';
import { CurrentUserDTO } from '../auth/dto/current-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { KAFKA_CLIENTS, KAFKA_TOPICS } from '../contants';
import { RefOneParams } from '../utils/validation';
import { AppointmentsService } from './appointments.service';
import { AppointmentDTO } from './dtos/appointment.dto';
import { CreateAppointmentDTO } from './dtos/create-appointment.dto';

@ApiTags('appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/v1/appointments')
@Controller()
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    @Inject(KAFKA_CLIENTS.SERVICES_SERVICE) private client: ClientKafka,
  ) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiOkResponse({
    description: 'The record has been successfully returned.',
    type: AppointmentDTO,
    isArray: true,
  })
  async getAll(
    @GetCurrentUser() user: CurrentUserDTO,
  ): Promise<AppointmentDTO[]> {
    const { id } = user;

    const appointmentEntities = await this.appointmentsService.getAll(id);

    return appointmentEntities.map(
      appointmentEntity => new AppointmentDTO(appointmentEntity),
    );
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get an appointment' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @ApiOkResponse({
    description: 'The record has been successfully returned.',
    type: AppointmentDTO,
    isArray: true,
  })
  async get(@Param() params: RefOneParams): Promise<AppointmentDTO> {
    const { id } = params;

    const appointmentEntity = await this.appointmentsService.getOne(id);

    return new AppointmentDTO(appointmentEntity);
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Create an appointment' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: AppointmentDTO,
  })
  async create(
    @Body() createAppointmentDTO: CreateAppointmentDTO,
    @GetCurrentUser() user: CurrentUserDTO,
  ): Promise<AppointmentDTO> {
    const { id } = user;

    const appointmentEntity = await this.appointmentsService.create(
      id,
      createAppointmentDTO,
    );

    return new AppointmentDTO(appointmentEntity);
  }

  @Post('/:id/cancel')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Cancel an appointment' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @ApiOkResponse({
    description: 'The record has been successfully canceled.',
    type: AppointmentDTO,
  })
  async cancel(@Param() params: RefOneParams): Promise<AppointmentDTO> {
    const { id } = params;

    const appointmentEntity = await this.appointmentsService.cancel(id);

    return new AppointmentDTO(appointmentEntity);
  }

  @Get('/next')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get Next Appointment' })
  @ApiOkResponse({
    description: 'The record has been successfully returned.',
    type: AppointmentDTO,
    isArray: false,
  })
  async getNextAppointment(
    @GetCurrentUser() user: CurrentUserDTO,
  ): Promise<AppointmentDTO> {
    const { id } = user;

    const appointmentEntity = await this.appointmentsService.getNext(id);

    return new AppointmentDTO(appointmentEntity);
  }

  @Post('/:id/finish')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Finish an appointment' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @ApiOkResponse({
    description: 'The record has been successfully finished.',
    type: AppointmentDTO,
  })
  async finish(@Param() params: RefOneParams): Promise<AppointmentDTO> {
    const { id } = params;

    const appointmentEntity = await this.appointmentsService.finish(id);

    await this.client
      .emit(KAFKA_TOPICS.APPOINTMENTS_UPDATE, { ...appointmentEntity })
      .toPromise();

    return new AppointmentDTO(appointmentEntity);
  }
}
