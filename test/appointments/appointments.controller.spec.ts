import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppointmentStatusEntity } from '../../src/appointments/appointment-status.entity';
import { AppointmentEntity } from '../../src/appointments/appointment.entity';
import { AppointmentsController } from '../../src/appointments/appointments.controller';
import { AppointmentsService } from '../../src/appointments/appointments.service';
import { AppointmentDTO } from '../../src/appointments/dtos/appointment.dto';
import { ServicePeriodsEntity } from '../../src/services/service-periods.entity';
import { ServiceEntity } from '../../src/services/service.entity';

describe('AppointmentsController', () => {
  let appointmentsController: AppointmentsController;
  let appointmentsService: AppointmentsService;

  let appointmentStatusEntity = new AppointmentStatusEntity();
  let serviceEntity = new ServiceEntity();

  const appointmentEntity: AppointmentEntity = {
    id: 'appointmentId',
    idUser: 'appointmentIdUser',
    idService: 'appointmentIdService',
    idServicePeriod: 'appointmentIdServicePeriod',
    idAppointmentStatus: 'appointmentIdAppointmentStatus',
    date: new Date(),
    service: serviceEntity,
    servicePeriod: null,
    appointmentStatus: appointmentStatusEntity,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  appointmentStatusEntity = {
    id: 'appointmentId',
    name: 'appointmentStatusEntityName',
    appointments: [appointmentEntity],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  serviceEntity = {
    id: 'appointmentId',
    name: 'Service Name',
    idCompany: 'idCompany',
    removed: false,
    appointments: [appointmentEntity],
    servicePeriods: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        AppointmentsService,
        {
          provide: getRepositoryToken(AppointmentEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ServiceEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ServicePeriodsEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    appointmentsController = moduleRef.get<AppointmentsController>(
      AppointmentsController,
    );
    appointmentsService = moduleRef.get<AppointmentsService>(
      AppointmentsService,
    );
  });

  describe('getAll', () => {
    it('should return all appointments', async () => {
      jest
        .spyOn(appointmentsService, 'getAll')
        .mockResolvedValueOnce([appointmentEntity]);

      expect(
        await appointmentsController.getAll({
          id: 'idUser',
          name: 'nameUser',
          email: 'emailUser',
        }),
      ).toStrictEqual([new AppointmentDTO(appointmentEntity)]);
    });
  });
});
