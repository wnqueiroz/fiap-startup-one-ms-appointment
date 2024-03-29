import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { KAFKA_TOPICS } from '../contants';
import { RefOneParams } from '../utils/validation';
import { ServicePeriodDTO } from './dtos/service-period.dto';
import { ServiceDTO } from './dtos/service.dto';
import { ServicesService } from './services.service';

@ApiTags('services')
@ApiBearerAuth()
@Controller('/v1/services')
@Controller()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('/')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get sevice by name' })
  @ApiOkResponse({
    description: 'The record has been successfully returned.',
    type: ServiceDTO,
    isArray: true,
  })
  async getService(@Query('name') name): Promise<ServiceDTO[]> {
    const serviceEntities = await this.servicesService.getServiceByName(name);

    return serviceEntities.map(serviceEntity => new ServiceDTO(serviceEntity));
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get one appointment' })
  @ApiOkResponse({
    description: 'The record has been successfully returned.',
    type: ServiceDTO,
  })
  async getOne(@Param() params: RefOneParams): Promise<ServiceDTO> {
    const { id } = params;

    const serviceEntity = await this.servicesService.getOne(id);

    return new ServiceDTO(serviceEntity);
  }

  @Get('/:id/available-periods')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all periods available from service' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @ApiOkResponse({
    description: 'The record has been successfully returned.',
    type: ServicePeriodDTO,
    isArray: true,
  })
  async getAvailablePeriods(
    @Param() params: RefOneParams,
  ): Promise<ServicePeriodDTO[]> {
    const { id } = params;

    const servicePeriodsEntities = await this.servicesService.getAvailablePeriods(
      id,
    );

    return servicePeriodsEntities.map(
      servicePeriodEntity => new ServicePeriodDTO(servicePeriodEntity),
    );
  }

  @MessagePattern(KAFKA_TOPICS.SERVICES_CREATED)
  async createService(
    @Payload()
    message: {
      value: any;
    },
  ): Promise<void> {
    const {
      id,
      idCompany,
      price,
      name,
      createdAt,
      updatedAt,
      companyName,
      companyAddress,
    } = message.value;

    await this.servicesService.createService({
      name,
      idCompany,
      id,
      price,
      companyName,
      companyAddress,
      createdAt,
      updatedAt,
    });
  }

  @MessagePattern(KAFKA_TOPICS.SERVICES_UPDATED)
  async updateService(
    @Payload()
    message: {
      value: any;
    },
  ): Promise<void> {
    const { id, name, updatedAt } = message.value;

    await this.servicesService.updateService(id, {
      name,
      updatedAt,
    });
  }

  @MessagePattern(KAFKA_TOPICS.SERVICES_DELETED)
  async deleteService(
    @Payload()
    message: {
      value: any;
    },
  ): Promise<void> {
    const { id } = message.value;

    await this.servicesService.deleteService(id);
  }

  @MessagePattern(KAFKA_TOPICS.SERVICE_PERIODS_CREATED)
  async createPeriod(
    @Payload()
    message: {
      value: any;
    },
  ): Promise<void> {
    await this.servicesService.createPeriod(message.value);
  }

  @MessagePattern(KAFKA_TOPICS.SERVICE_PERIODS_DELETED)
  async deletePeriod(
    @Payload()
    message: {
      value: any;
    },
  ): Promise<void> {
    const { id } = message.value;

    await this.servicesService.deletePeriod(id);
  }
}
