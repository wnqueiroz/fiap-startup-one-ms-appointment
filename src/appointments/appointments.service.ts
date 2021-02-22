import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { APPOINTMENT_STATUS } from '../contants';
import { ServicePeriodsEntity } from '../services/service-periods.entity';
import { ServiceEntity } from '../services/service.entity';
import { AppointmentEntity } from './appointment.entity';
import { CreateAppointmentDTO } from './dtos/create-appointment.dto';
import { UpdateAppointmentDTO } from './dtos/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(AppointmentEntity)
    private appointmenRepository: Repository<AppointmentEntity>,
    @InjectRepository(ServiceEntity)
    private serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(ServicePeriodsEntity)
    private servicePeriodsRepository: Repository<ServicePeriodsEntity>,
  ) {}

  getAll(idUser: string): Promise<AppointmentEntity[]> {
    return this.appointmenRepository.find({
      where: {
        idUser,
      },
    });
  }

  async getOne(id: string): Promise<AppointmentEntity> {
    const appointmentEntity = await this.appointmenRepository.findOne(id, {
      relations: ['servicePeriods'],
    });

    if (!appointmentEntity)
      throw new NotFoundException('Appointment not found');

    return appointmentEntity;
  }

  async cancel(id: string): Promise<AppointmentEntity> {
    const appointmentEntity = await this.getOne(id);

    return this.appointmenRepository.save({
      ...appointmentEntity,
      idAppointmentStatus: APPOINTMENT_STATUS.CANCEL_CUSTUMER,
    });
  }

  async create(
    createAppointmentDTO: CreateAppointmentDTO,
  ): Promise<AppointmentEntity> {
    const serviceExists = await this.serviceRepository.findOne(
      createAppointmentDTO.idService,
    );

    if (!serviceExists) throw new NotFoundException('Service not found');

    const periodoExists = await this.servicePeriodsRepository.findOne(
      createAppointmentDTO.idServicePeriod,
    );

    if (!periodoExists) throw new NotFoundException('Period not found');

    const appointmentEntity = this.appointmenRepository.create({
      ...createAppointmentDTO,
      idAppointmentStatus: APPOINTMENT_STATUS.PENDING,
    });

    return await this.appointmenRepository.save(appointmentEntity);
  }

  async updateOne(
    id: string,
    updateAppointmentDTO: UpdateAppointmentDTO,
  ): Promise<AppointmentEntity> {
    const appointmentEntity = await this.getOne(id);

    return this.appointmenRepository.save({
      ...appointmentEntity,
      ...updateAppointmentDTO,
    });
  }
}
