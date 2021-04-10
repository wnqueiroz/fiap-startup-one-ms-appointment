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
    private appointmentRepository: Repository<AppointmentEntity>,
    @InjectRepository(ServiceEntity)
    private serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(ServicePeriodsEntity)
    private servicePeriodsRepository: Repository<ServicePeriodsEntity>,
  ) {}

  getAll(idUser: string): Promise<AppointmentEntity[]> {
    return this.appointmentRepository.find({
      where: {
        idUser,
      },
      relations: ['service', 'servicePeriod', 'appointmentStatus'],
    });
  }

  async getOne(id: string): Promise<AppointmentEntity> {
    const appointmentEntity = await this.appointmentRepository.findOne(id, {
      relations: ['servicePeriod'],
    });

    if (!appointmentEntity)
      throw new NotFoundException('Appointment not found');

    return appointmentEntity;
  }

  async cancel(id: string): Promise<AppointmentEntity> {
    const appointmentEntity = await this.getOne(id);

    // TODO: cancel only appointment that not canceled by customer or system

    return this.appointmentRepository.save({
      ...appointmentEntity,
      idAppointmentStatus: APPOINTMENT_STATUS.CANCEL_CUSTOMER,
    });
  }

  async finish(id: string): Promise<AppointmentEntity> {
    const appointmentEntity = await this.getOne(id);

    // TODO: cancel only appointment that not canceled by customer or system

    return this.appointmentRepository.save({
      ...appointmentEntity,
      idAppointmentStatus: APPOINTMENT_STATUS.FINISHED,
    });
  }

  // TODO: check payload returned from this
  async create(
    idUser: string,
    createAppointmentDTO: CreateAppointmentDTO,
  ): Promise<AppointmentEntity> {
    const serviceExists = await this.serviceRepository.findOne(
      createAppointmentDTO.idService,
    );

    if (!serviceExists) throw new NotFoundException('Service not found');

    const servicePeriodExists = await this.servicePeriodsRepository.findOne(
      createAppointmentDTO.idServicePeriod,
    );

    if (!servicePeriodExists)
      throw new NotFoundException('Service period not found');

    // TODO: check if the service period is available (check if the appointment with that service period already exists)

    const appointmentEntity = this.appointmentRepository.create({
      ...createAppointmentDTO,
      idUser,
      idAppointmentStatus: APPOINTMENT_STATUS.PENDING,
    });

    return this.appointmentRepository.save(appointmentEntity);
  }

  async updateOne(
    id: string,
    updateAppointmentDTO: UpdateAppointmentDTO,
  ): Promise<AppointmentEntity> {
    const appointmentEntity = await this.getOne(id);

    return this.appointmentRepository.save({
      ...appointmentEntity,
      ...updateAppointmentDTO,
    });
  }

  async getNext(id: string): Promise<AppointmentEntity> {
    const nextAppointmentEntity = this.appointmentRepository
      .createQueryBuilder('ap')
      .innerJoin('service_periods', 'sp', 'ap.idServicePeriod = sp.id')
      .where('ap.idUser = :id', { id: id })
      .andWhere('ap.idAppointmentStatus = :status', {
        status: APPOINTMENT_STATUS.PENDING,
      })
      .andWhere('ap.date >= now()')
      .orderBy('ap.date', 'ASC')
      .addOrderBy('sp.startTime', 'ASC')
      .getOne();
    return nextAppointmentEntity;
  }
}
