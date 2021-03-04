import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppointmentEntity } from '../../src/appointments/appointment.entity';
import { APPOINTMENT_STATUS } from '../../src/contants';
import { CreateServiceDTO } from '../../src/services/dtos/create-service.dto';
import { ServicePeriodDTO } from '../../src/services/dtos/service-period.dto';
import { ServicePeriodsEntity } from '../../src/services/service-periods.entity';
import { ServiceEntity } from '../../src/services/service.entity';
import { ServicesService } from '../../src/services/services.service';

describe('ServicesService', () => {
  let servicesService: ServicesService;
  let servicesRepository: Repository<ServiceEntity>;
  let servicePeriodsRepository: Repository<ServicePeriodsEntity>;

  const idService = 'uuid';
  const idServicePeriod = 'uuid';

  let serviceEntity = new ServiceEntity();
  let servicePeriodsEntity = new ServicePeriodsEntity();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ServicesService,
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

    servicesService = moduleRef.get<ServicesService>(ServicesService);
    servicesRepository = moduleRef.get<Repository<ServiceEntity>>(
      getRepositoryToken(ServiceEntity),
    );
    servicePeriodsRepository = moduleRef.get<Repository<ServicePeriodsEntity>>(
      getRepositoryToken(ServicePeriodsEntity),
    );

    serviceEntity = new ServiceEntity();
    servicePeriodsEntity = new ServicePeriodsEntity();
  });

  describe('getAvailablePeriods', () => {
    it('should throw an exception when the service with the id does not exist', async () => {
      jest.spyOn(servicesRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        servicesService.getAvailablePeriods(idService),
      ).rejects.toThrow('Service not found');
      expect(servicesRepository.findOne).toBeCalledWith(idService);
    });

    it('should return all available service periods for a service', async () => {
      jest
        .spyOn(servicesRepository, 'findOne')
        .mockResolvedValueOnce(serviceEntity);

      jest
        .spyOn(servicePeriodsRepository, 'find')
        .mockResolvedValueOnce([servicePeriodsEntity]);

      const result = await servicesService.getAvailablePeriods(idService);

      expect(result).toStrictEqual([servicePeriodsEntity]);
      expect(servicePeriodsRepository.find).toBeCalledWith({
        where: {
          idService,
          removed: false,
        },
      });
      expect(servicesRepository.findOne).toBeCalledWith(idService);
    });
  });

  describe('createPeriod', () => {
    it('should throw an exception when the service with the id does not exist', async () => {
      const servicePeriodDto = new ServicePeriodDTO({
        idService,
      });
      jest.spyOn(servicesRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        servicesService.createPeriod(servicePeriodDto),
      ).rejects.toThrow('Service not found');
      expect(servicesRepository.findOne).toBeCalledWith(
        servicePeriodDto.idService,
      );
    });

    it('should create a service period successfully', async () => {
      const servicePeriodDto = new ServicePeriodDTO({
        idService,
      });
      jest
        .spyOn(servicesRepository, 'findOne')
        .mockResolvedValueOnce(serviceEntity);
      jest
        .spyOn(servicePeriodsRepository, 'create')
        .mockReturnValueOnce(servicePeriodsEntity);
      jest
        .spyOn(servicePeriodsRepository, 'save')
        .mockResolvedValueOnce(servicePeriodsEntity);

      const result = await servicesService.createPeriod(servicePeriodDto);

      expect(result).toBe(undefined);
      expect(servicesRepository.findOne).toBeCalledWith(
        servicePeriodDto.idService,
      );
      expect(servicePeriodsRepository.create).toBeCalledWith({
        ...servicePeriodDto,
      });
      expect(servicePeriodsRepository.save).toBeCalledWith(
        servicePeriodsEntity,
      );
    });
  });

  describe('createService', () => {
    it('should create a service successfully', async () => {
      const createServiceDto = new CreateServiceDTO();

      jest
        .spyOn(servicesRepository, 'create')
        .mockReturnValueOnce(serviceEntity);
      jest.spyOn(servicesRepository, 'save').mockResolvedValueOnce(null);

      const result = await servicesService.createService(createServiceDto);

      expect(result).toBe(undefined);
      expect(servicesRepository.create).toBeCalledWith(createServiceDto);
      expect(servicesRepository.save).toBeCalledWith(serviceEntity);
    });
  });

  describe('deleteService', () => {
    it(`should delete a service and its children's (service periods and appointments related)`, async () => {
      serviceEntity.servicePeriods = [servicePeriodsEntity];
      serviceEntity.appointments = [new AppointmentEntity()];

      jest
        .spyOn(servicesRepository, 'findOne')
        .mockResolvedValueOnce(serviceEntity);
      jest.spyOn(servicesRepository, 'save').mockResolvedValueOnce(null);

      const result = await servicesService.deleteService(idService);

      expect(result).toBe(undefined);
      expect(servicesRepository.save).toBeCalledWith({
        ...serviceEntity,
        servicePeriods: [
          {
            removed: true,
          },
        ],
        appointments: [
          { idAppointmentStatus: APPOINTMENT_STATUS.CANCEL_SYSTEM },
        ],
        removed: true,
      });
    });

    it('should only delete the service (when there are no service periods and appointments)', async () => {
      serviceEntity.servicePeriods = null;
      serviceEntity.appointments = null;

      jest
        .spyOn(servicesRepository, 'findOne')
        .mockResolvedValueOnce(serviceEntity);
      jest.spyOn(servicesRepository, 'save').mockResolvedValueOnce(null);

      const result = await servicesService.deleteService(idService);

      expect(result).toBe(undefined);
      expect(servicesRepository.save).toBeCalledWith({
        ...serviceEntity,
      });
    });
  });

  describe('deletePeriod', () => {
    it('should delete period successfully', async () => {
      jest.spyOn(servicePeriodsRepository, 'findOne').mockResolvedValueOnce({
        ...servicePeriodsEntity,
        appointments: [new AppointmentEntity()],
      });
      jest.spyOn(servicesRepository, 'save').mockResolvedValueOnce(null);

      const result = await servicesService.deletePeriod(idServicePeriod);

      expect(result).toBe(undefined);
      expect(servicePeriodsRepository.findOne).toBeCalledWith(idServicePeriod);
      expect(servicesRepository.save).toBeCalledWith({
        ...servicePeriodsEntity,
        appointments: [
          {
            idAppointmentStatus: APPOINTMENT_STATUS.CANCEL_SYSTEM,
          },
        ],
        removed: true,
      });
    });
  });
});
