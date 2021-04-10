import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { APPOINTMENT_STATUS } from '../contants';
import { ServicePeriodsEntity } from '../services/service-periods.entity';
import { CreateServiceDTO } from './dtos/create-service.dto';
import { ServicePeriodDTO } from './dtos/service-period.dto';
import { UpdateServiceDTO } from './dtos/update-service.dto';
import { ServiceEntity } from './service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceEntity)
    private servicesRepository: Repository<ServiceEntity>,
    @InjectRepository(ServicePeriodsEntity)
    private servicePeriodsRepository: Repository<ServicePeriodsEntity>,
  ) {}

  async getServiceByName(name: string): Promise<ServiceEntity[]> {
    const serviceEntities = await this.servicesRepository
      .createQueryBuilder('services')
      .innerJoinAndSelect('services.servicePeriods', 'servicePeriods')
      .where('LOWER(name) LIKE :name', { name: `%${name.toLowerCase()}%` })
      .getMany();
    return serviceEntities;
  }

  async getOne(id: string): Promise<ServiceEntity> {
    const serviceEntity = await this.servicesRepository.findOne(id, {
      relations: ['servicePeriods'],
    });

    if (!serviceEntity) {
      throw new NotFoundException('Service not found');
    }

    return serviceEntity;
  }

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

  async createPeriod(period: ServicePeriodDTO): Promise<void> {
    const serviceExists = await this.servicesRepository.findOne(
      period.idService,
    );

    if (!serviceExists) throw new NotFoundException('Service not found');

    const periodEntity = this.servicePeriodsRepository.create({
      ...period,
    });

    await this.servicePeriodsRepository.save(periodEntity);
  }

  async createService(createServiceDTO: CreateServiceDTO): Promise<void> {
    const serviceEntity = this.servicesRepository.create(createServiceDTO);

    await this.servicesRepository.save(serviceEntity);
  }

  async deleteService(idService: string): Promise<void> {
    const entity = await this.servicesRepository.findOne(idService, {
      relations: ['servicePeriods', 'appointments'],
    });

    entity.removed = true;

    if (entity.servicePeriods)
      entity.servicePeriods = entity.servicePeriods.map(servicePeriods => ({
        ...servicePeriods,
        removed: true,
      }));

    if (entity.appointments)
      entity.appointments = entity.appointments.map(appointment => ({
        ...appointment,
        idAppointmentStatus: APPOINTMENT_STATUS.CANCEL_SYSTEM,
      }));

    await this.servicesRepository.save(entity);
  }

  async deletePeriod(idServicePeriod: string): Promise<void> {
    const entity = await this.servicePeriodsRepository.findOne(idServicePeriod);

    entity.appointments.map(
      appointment =>
        (appointment.idAppointmentStatus = APPOINTMENT_STATUS.CANCEL_SYSTEM),
    );

    entity.removed = true;

    await this.servicesRepository.save(entity);
  }

  async updateService(
    idService: string,
    payload: UpdateServiceDTO,
  ): Promise<void> {
    const entity = await this.servicesRepository.findOne(idService);

    if (!entity) throw new NotFoundException('Service not found');

    await this.servicesRepository.save({
      ...entity,
      ...payload,
    });
  }
}
