import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppointmentStatusEntity } from '../../src/appointments/appointment-status.entity';
import { AppointmentEntity } from '../../src/appointments/appointment.entity';
import { AppointmentsService } from '../../src/appointments/appointments.service';
import { CreateAppointmentDTO } from '../../src/appointments/dtos/create-appointment.dto';
import { APPOINTMENT_STATUS } from '../../src/contants';
import { ServicePeriodsEntity } from '../../src/services/service-periods.entity';
import { ServiceEntity } from '../../src/services/service.entity';

describe('AppointmentsService', () => {
  let appointmentsService: AppointmentsService;

  let appointmentRepository: Repository<AppointmentEntity>;
  let serviceRepository: Repository<ServiceEntity>;
  let servicePeriodsRepository: Repository<ServicePeriodsEntity>;

  let appointmentEntity: AppointmentEntity = new AppointmentEntity();
  let servicePeriodsEntity = new ServicePeriodsEntity();

  const createService: ServiceEntity = {
    id: 'uuid',
    name: 'serviceName',
    idCompany: 'uuid',
    removed: false,
    appointments: [appointmentEntity],
    servicePeriods: [servicePeriodsEntity],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  servicePeriodsEntity = {
    id: 'uuid',
    idService: 'uuid',
    service: createService,
    appointments: [appointmentEntity],
    startTime: 'time',
    endTime: 'time',
    removed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const appointmentStatusEntity: AppointmentStatusEntity = {
    id: 'uuid',
    name: 'uuid',
    appointments: [appointmentEntity],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  appointmentEntity = {
    id: 'uuid',
    idUser: 'uuid',
    idService: 'uuid',
    idServicePeriod: 'uuid',
    idAppointmentStatus: 'uuid',
    date: new Date(),
    service: createService,
    servicePeriod: servicePeriodsEntity,
    appointmentStatus: appointmentStatusEntity,
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
    serviceRepository = moduleRef.get<Repository<ServiceEntity>>(
      getRepositoryToken(ServiceEntity),
    );
    servicePeriodsRepository = moduleRef.get<Repository<ServicePeriodsEntity>>(
      getRepositoryToken(ServicePeriodsEntity),
    );
  });

  describe('getAll', () => {
    it('should return all created appointments', async () => {
      const result = [appointmentEntity];

      jest.spyOn(appointmentRepository, 'find').mockResolvedValueOnce(result);
      expect(await appointmentsService.getAll('idAppointment')).toBe(result);
    });
  });

  describe('getOne', () => {
    it('should return one service', async () => {
      jest
        .spyOn(appointmentRepository, 'findOne')
        .mockResolvedValueOnce(appointmentEntity);

      expect(await appointmentsService.getOne('uuid')).toBe(appointmentEntity);
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
        .mockResolvedValueOnce(appointmentEntity);

      jest
        .spyOn(appointmentRepository, 'save')
        .mockResolvedValueOnce(appointmentEntity);

      expect(await appointmentsService.cancel(id)).toBe(appointmentEntity);
      expect(appointmentsService.getOne).toBeCalledWith(id);
      expect(appointmentRepository.save).toBeCalledWith({
        ...appointmentEntity,
        idAppointmentStatus: APPOINTMENT_STATUS.CANCEL_CUSTOMER,
      });
    });
  });

  describe('create', () => {
    const idUser = 'uuid';
    const idService = 'foo';
    const idServicePeriod = 'bar';

    const createAppointmentDto = new CreateAppointmentDTO({
      idService,
      idServicePeriod,
    });

    it(`should throw an exception when the service passed it's NOT exists`, async () => {
      jest.spyOn(serviceRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        appointmentsService.create(idUser, createAppointmentDto),
      ).rejects.toThrow('Service not found');
      expect(serviceRepository.findOne).toBeCalledWith(idService);
    });

    it(`should throw an exception when the service period passed it's NOT exists`, async () => {
      jest
        .spyOn(serviceRepository, 'findOne')
        .mockResolvedValueOnce(createService);
      jest
        .spyOn(servicePeriodsRepository, 'findOne')
        .mockResolvedValueOnce(null);

      await expect(
        appointmentsService.create(idUser, createAppointmentDto),
      ).rejects.toThrow('Service period not found');
      expect(serviceRepository.findOne).toBeCalledWith(idService);
      expect(servicePeriodsRepository.findOne).toBeCalledWith(idServicePeriod);
    });

    it('should create an appointment', async () => {
      jest
        .spyOn(serviceRepository, 'findOne')
        .mockResolvedValueOnce(createService);
      jest
        .spyOn(servicePeriodsRepository, 'findOne')
        .mockResolvedValueOnce(servicePeriodsEntity);
      jest
        .spyOn(appointmentRepository, 'create')
        .mockReturnValueOnce(appointmentEntity);
      jest
        .spyOn(appointmentRepository, 'save')
        .mockResolvedValueOnce(appointmentEntity);

      const result = await appointmentsService.create(
        idUser,
        createAppointmentDto,
      );

      expect(result).toBe(appointmentEntity);
      expect(serviceRepository.findOne).toBeCalledWith(idService);
      expect(servicePeriodsRepository.findOne).toBeCalledWith(idServicePeriod);
      expect(appointmentRepository.create).toBeCalledWith({
        ...createAppointmentDto,
        idUser,
        idAppointmentStatus: APPOINTMENT_STATUS.PENDING,
      });
      expect(appointmentRepository.save).toBeCalledWith(appointmentEntity);
    });
  });
});
