import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { APPOINTMENT_STATUS } from '../contants';
import { ServicePeriodsEntity } from '../services/service-periods.entity';
import { ServicePeriodDTO } from './dtos/service-period.dto';
import { ServiceDTO } from './dtos/service.dto';
import { ServiceEntity } from './service.entity';

type KafkaObject = {
  service?: ServiceDTO;
  period?: ServicePeriodDTO;
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
        removed: false,
      },
    });
  }

  async createPeriod(params: KafkaObject): Promise<void> {
    const { period } = params;

    const serviceExists = await this.servicesRepository.findOne(
      period.idService,
    );

    if (!serviceExists) throw new NotFoundException('Service not found');

    const periodEntity = this.servicePeriodsRepository.create({
      ...period,
    });

    await this.servicePeriodsRepository.save(periodEntity);
  }

  async createService(params: KafkaObject): Promise<void> {
    const { service } = params;

    const serviceEntity = this.servicesRepository.create({
      ...service,
    });

    await this.servicesRepository.save(serviceEntity);
  }

  async deleteService(params: KafkaObject): Promise<void> {
    const { service } = params;

    const entity = await this.servicesRepository.findOne(service.id, {
      relations: ['servicePeriods'],
    });

    entity.removed = true;

    entity.servicePeriods.map(period => (period.removed = true));

    entity.appointments.map(
      appointment =>
        (appointment.idAppointmentStatus = APPOINTMENT_STATUS.CANCEL_SYSTEM),
    );

    await this.servicesRepository.save(entity);
  }

  async deletePeriod(params: KafkaObject): Promise<void> {
    const { period } = params;

    const entity = await this.servicePeriodsRepository.findOne(period.id);

    entity.appointments.map(
      appointment =>
        (appointment.idAppointmentStatus = APPOINTMENT_STATUS.CANCEL_SYSTEM),
    );

    entity.removed = true;

    await this.servicesRepository.save(entity);
  }

  async updateService(params: KafkaObject): Promise<void> {
    const { service } = params;

    const entity = await this.servicesRepository.findOne(service.id);

    if (!entity) throw new NotFoundException('Service not found');

    await this.servicePeriodsRepository.save({
      ...entity,
      ...service,
    });
  }
}
