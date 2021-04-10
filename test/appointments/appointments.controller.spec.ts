import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppointmentStatusEntity } from '../../src/appointments/appointment-status.entity';
import { AppointmentEntity } from '../../src/appointments/appointment.entity';
import { AppointmentsController } from '../../src/appointments/appointments.controller';
import { AppointmentsService } from '../../src/appointments/appointments.service';
import { AppointmentDTO } from '../../src/appointments/dtos/appointment.dto';
import { KAFKA_CLIENTS } from '../../src/contants';
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
    price: 60,
    idCompany: 'idCompany',
    removed: false,
    companyAddress: 'Company Address',
    companyName: 'Company Name',
    appointments: [appointmentEntity],
    servicePeriods: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockToPromiseClientKafka = jest.fn(async () => null);
  const mockToEmitClientKafka = jest.fn(() => ({
    toPromise: mockToPromiseClientKafka,
  }));

  beforeEach(async () => {
    const MockClientKafka = {
      emit: mockToEmitClientKafka,
    };

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
        {
          provide: KAFKA_CLIENTS.SERVICES_SERVICE,
          useFactory: () => MockClientKafka,
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

  describe('create', () => {
    it('should return a create service', async () => {
      const appointment: AppointmentEntity = appointmentEntity;
      const expectedAppointmentDTO = new AppointmentDTO(appointment);

      jest
        .spyOn(appointmentsService, 'create')
        .mockResolvedValueOnce(appointmentEntity);

      expect(
        await appointmentsController.create(
          {
            idService: 'idService',
            idServicePeriod: 'idServicePeriod',
            date: '2021-02-28',
          },
          {
            id: 'idUser',
            name: 'userName',
            email: 'userMail',
          },
        ),
      ).toStrictEqual(expectedAppointmentDTO);
    });
  });

  describe('cancel', () => {
    it('should return a cancel service', async () => {
      jest
        .spyOn(appointmentsService, 'cancel')
        .mockResolvedValueOnce(appointmentEntity);

      expect(
        await appointmentsController.cancel({
          id: 'idUser',
        }),
      ).toStrictEqual(new AppointmentDTO(appointmentEntity));
    });
  });
});
