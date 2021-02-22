import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
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
  constructor(private readonly appointmentsService: AppointmentsService) {}

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
    const { id: idUser } = user;
    const appointmentEntities = await this.appointmentsService.getAll(idUser);

    return appointmentEntities.map(
      appointmentEntity => new AppointmentDTO(appointmentEntity),
    );
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
  ): Promise<AppointmentDTO> {
    const appointmentEntity = await this.appointmentsService.create(
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
}
