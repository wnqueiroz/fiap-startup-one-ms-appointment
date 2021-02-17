import { ServicePeriodsEntity } from 'src/services/service-periods.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from './service.entity';
import { ServicePeriodDTO } from './dtos/service-period.dto';
import { ServiceDTO } from './dtos/service.dto';

type updatePeriods = {
  period: ServicePeriodDTO;
};

type updateServices = {
  service: ServiceDTO;
};

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceEntity)
    private servicesRepository: Repository<ServiceEntity>,
    @InjectRepository(ServicePeriodsEntity)
    private servicePeriodsRepository: Repository<ServicePeriodsEntity>,
  ) {}

  async getAvailablePeriods(
    idService: string,
  ): Promise<ServicePeriodsEntity[]> {
    const exists = await this.servicesRepository.findOne(idService);

    if (!exists) throw new NotFoundException('Service not found');

    return this.servicePeriodsRepository.find({
      where: {
        idService,
      },
    });
  }

  async createPeriods(params: updatePeriods): Promise<void> {
    const { period } = params;

    const serviceExists = await this.servicesRepository.findOne(
      period.idService,
    );

    if (!serviceExists) throw new NotFoundException('Service not found');

    const periodoExists = await this.servicePeriodsRepository.findOne(
      period.id,
    );

    let periodEntity = {};

    if (!periodoExists) {
      periodEntity = this.servicePeriodsRepository.create({
        ...period,
      });
    }

    await this.servicePeriodsRepository.save({
      ...periodEntity,
      ...period,
    });
  }

  async createServices(params: updateServices): Promise<void> {
    const { service } = params;

    const serviceExists = await this.servicesRepository.findOne(service.id);

    let serviceEntity = {};

    if (!serviceExists) {
      serviceEntity = this.servicesRepository.create({
        ...service,
      });
    }

    await this.servicesRepository.save({
      ...serviceEntity,
      ...service,
    });
  }
}
