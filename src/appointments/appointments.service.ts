import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServicePeriodsEntity } from 'src/services/service-periods.entity';
import { ServiceEntity } from 'src/services/service.entity';
import { Repository } from 'typeorm';
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
      ...{ idAppointmentStatus: '4423B247-3044-4141-8B1E-CB5B8940660E' },
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
      ...{ idAppointmentStatus: '7E20F944-8204-45BE-AA06-2E5C29B9A62D' },
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
