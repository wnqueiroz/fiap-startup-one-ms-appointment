import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
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
import { ServicesService } from './services.service';

@ApiTags('services')
@ApiBearerAuth()
@Controller('/v1/services')
@Controller()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

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
  async createServices(
    @Payload()
    message: {
      value: {
        service;
      };
    },
  ): Promise<void> {
    const { id, idCompany, name, createdAt, updatedAt } = message.value as any;

    await this.servicesService.createService({
      name,
      idCompany,
      id,
      createdAt,
      updatedAt,
    });
  }

  @MessagePattern(KAFKA_TOPICS.SERVICES_UPDATED)
  async updateServices(
    @Payload()
    message: {
      value: {
        service;
      };
    },
  ): Promise<void> {
    const { id, name, updatedAt } = message.value as any;

    await this.servicesService.updateService(id, {
      name,
      updatedAt,
    });
  }

  @MessagePattern(KAFKA_TOPICS.SERVICES_DELETED)
  async deleteServices(
    @Payload()
    message: {
      value: {
        service;
      };
    },
  ): Promise<void> {
    const { id } = message.value as any;

    await this.servicesService.deleteService(id);
  }

  @MessagePattern(KAFKA_TOPICS.SERVICE_PERIODS_CREATED)
  async createPeriod(
    @Payload()
    message: {
      value: {
        period;
      };
    },
  ): Promise<void> {
    await this.servicesService.createPeriod(message.value as any);
  }

  @MessagePattern(KAFKA_TOPICS.SERVICE_PERIODS_DELETED)
  async deletePeriod(
    @Payload()
    message: {
      value: {
        period;
      };
    },
  ): Promise<void> {
    const { id } = message.value as any;

    await this.servicesService.deletePeriod(id);
  }
}
