import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppointmentStatusEntity } from '../../src/appointments/appointment-status.entity';
import { AppointmentEntity } from '../../src/appointments/appointment.entity';
import { AppointmentsService } from '../../src/appointments/appointments.service';
import { APPOINTMENT_STATUS } from '../../src/contants';
import { ServicePeriodsEntity } from '../../src/services/service-periods.entity';
import { ServiceEntity } from '../../src/services/service.entity';

describe('AppointmentsService', () => {
  let appointmentsService: AppointmentsService;
  let appointmentRepository: Repository<AppointmentEntity>;
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
    appointmentRepository = moduleRef.get<Repository<AppointmentEntity>>(
      getRepositoryToken(AppointmentEntity),
    );
  });

  describe('getAll', () => {
    it('should return all created appointments', async () => {
      const result = [createAppointment];

      jest.spyOn(appointmentRepository, 'find').mockResolvedValueOnce(result);
      expect(await appointmentsService.getAll('idAppointment')).toBe(result);
    });
  });

  describe('getOne', () => {
    it('should return one service', async () => {
      jest
        .spyOn(appointmentRepository, 'findOne')
        .mockResolvedValueOnce(createAppointment);

      expect(await appointmentsService.getOne('uuid')).toBe(createAppointment);
    });

    it('should thrown an exception when there is no appointment', async () => {
      jest.spyOn(appointmentRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(appointmentsService.getOne('uuid')).rejects.toThrow(
        'Appointment not found',
      );
    });
  });

  describe('cancel', () => {
    it('should cancel an appointment', async () => {
      const id = 'uuid';
      jest
        .spyOn(appointmentsService, 'getOne')
        .mockResolvedValueOnce(createAppointment);

      jest
        .spyOn(appointmentRepository, 'save')
        .mockResolvedValueOnce(createAppointment);

      expect(await appointmentsService.cancel(id)).toBe(createAppointment);
      expect(appointmentsService.getOne).toBeCalledWith(id);
      expect(appointmentRepository.save).toBeCalledWith({
        ...createAppointment,
        idAppointmentStatus: APPOINTMENT_STATUS.CANCEL_CUSTOMER,
      });
    });
  });
});
