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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { KAFKA_TOPICS } from 'src/contants';
import { RefOneParams } from 'src/utils/validation';
import { ServicePeriodDTO } from './dtos/service-period.dto';
import { ServicesService } from './services.service';

@ApiTags('services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/v1/services')
@Controller()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('/:id/available-periods')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get all periods avaiable from service' })
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

    const periodsEntities = await this.servicesService.getAvailablePeriods(id);

    return periodsEntities.map(
      serviceEntity => new ServicePeriodDTO(serviceEntity),
    );
  }

  @MessagePattern(KAFKA_TOPICS.SERVICE_PERIODS_CREATED)
  async createPeriods(
    @Payload()
    message: {
      value: {
        period;
      };
    },
  ): Promise<void> {
    await this.servicesService.createPeriods(message.value);
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
    await this.servicesService.createServices(message.value);
  }
}
