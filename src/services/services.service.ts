import { ServicePeriodsEntity } from 'src/services/service-periods.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from './service.entity';

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
}
