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
import { GetCurrentUser } from 'src/auth/auth.annotation';
import { AuthService } from 'src/auth/auth.service';
import { CurrentUserDTO } from 'src/auth/dto/current-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RefOneParams } from 'src/utils/validation';
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
    private readonly authService: AuthService,
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
    const { id: idUser } = user;
    const companyEntities = await this.appointmentsService.getAll(idUser);

    return companyEntities.map(
      companyEntity => new AppointmentDTO(companyEntity),
    );
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Create a company' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: AppointmentDTO,
  })
  async create(
    @Body() createAppointmentDTO: CreateAppointmentDTO,
  ): Promise<AppointmentDTO> {
    const entity = await this.appointmentsService.create(createAppointmentDTO);

    return new AppointmentDTO(entity);
  }

  @Post('/:id/cancel')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Cancel one appointment' })
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

    const entity = await this.appointmentsService.cancel(id);

    return new AppointmentDTO(entity);
  }
}
