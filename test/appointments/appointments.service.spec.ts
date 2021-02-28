import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppointmentStatusEntity } from 'src/appointments/appointment-status.entity';
import { Repository } from 'typeorm';

import { AppointmentEntity } from '../../src/appointments/appointment.entity';
import { AppointmentsService } from '../../src/appointments/appointments.service';
import { ServicePeriodsEntity } from '../../src/services/service-periods.entity';
import { ServiceEntity } from '../../src/services/service.entity';

describe('AppointmentsService', () => {
  let appointmentsService: AppointmentsService;
  let appointmentsRepository: Repository<AppointmentEntity>;
  let createAppointment = new AppointmentEntity();
  let createServicePeriods = new ServicePeriodsEntity();

  const createService: ServiceEntity = {
    id: 'uuid',
    name: 'serviceName',
    idCompany: 'uuid',
    removed: false,
    appointments: [createAppointment],
    servicePeriods: [createServicePeriods],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  createServicePeriods = {
    id: 'uuid',
    idService: 'uuid',
    service: createService,
    appointments: [createAppointment],
    startTime: 'time',
    endTime: 'time',
    removed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createAppointmentStatus: AppointmentStatusEntity = {
    id: 'uuid',
    name: 'uuid',
    appointments: [createAppointment],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  createAppointment = {
    id: 'uuid',
    idUser: 'uuid',
    idService: 'uuid',
    idServicePeriod: 'uuid',
    idAppointmentStatus: 'uuid',
    date: new Date(),
    service: createService,
    servicePeriod: createServicePeriods,
    appointmentStatus: createAppointmentStatus,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
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

    appointmentsService = moduleRef.get<AppointmentsService>(
      AppointmentsService,
    );
    appointmentsRepository = moduleRef.get<Repository<AppointmentEntity>>(
      getRepositoryToken(AppointmentEntity),
    );
  });

  describe('getAll', () => {
    it('should return all created appointments', async () => {
      const result = [createAppointment];

      jest.spyOn(appointmentsRepository, 'find').mockResolvedValueOnce(result);
      expect(await appointmentsService.getAll('idAppointment')).toBe(result);
    });
  });
});
