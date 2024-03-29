import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { KAFKA_CLIENTS, KAFKA_TOPICS } from '../../src/contants';
import { ServicePeriodDTO } from '../../src/services/dtos/service-period.dto';
import { ServicePeriodsEntity } from '../../src/services/service-periods.entity';
import { ServiceEntity } from '../../src/services/service.entity';
import { ServicesController } from '../../src/services/services.controller';
import { ServicesService } from '../../src/services/services.service';
import { RefOneParams } from '../../src/utils/validation';

describe('ServicesController', () => {
  let servicesController: ServicesController;
  let servicesService: ServicesService;

  const params: RefOneParams = {
    id: 'uuid',
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
      controllers: [ServicesController],
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
        {
          provide: KAFKA_CLIENTS.SERVICES_SERVICE,
          useFactory: () => MockClientKafka,
        },
      ],
    }).compile();

    servicesController = moduleRef.get<ServicesController>(ServicesController);
    servicesService = moduleRef.get<ServicesService>(ServicesService);
  });

  describe('getAvailablePeriods', () => {
    it('should return all available service periods for a service', async () => {
      const servicePeriodsEntities = [new ServicePeriodsEntity()];
      jest
        .spyOn(servicesService, 'getAvailablePeriods')
        .mockResolvedValueOnce(servicePeriodsEntities);

      const result = await servicesController.getAvailablePeriods(params);
      expect(result).toStrictEqual(
        servicePeriodsEntities.map(
          servicePeriodEntity => new ServicePeriodDTO(servicePeriodEntity),
        ),
      );
      expect(servicesService.getAvailablePeriods).toBeCalledWith(params.id);
    });
  });

  describe('createService', () => {
    it(`should create a service from "${KAFKA_TOPICS.SERVICES_CREATED}" kafka topic`, async () => {
      const service = {
        id: 'uuid',
        idCompany: 'uuid',
        name: 'foo',
        companyName: 'foo',
        companyAddress: 'foo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const payload = {
        value: service,
      };

      jest.spyOn(servicesService, 'createService').mockResolvedValueOnce(null);

      const result = await servicesController.createService(payload);

      expect(result).toBe(undefined);
      expect(servicesService.createService).toBeCalledWith(service);
    });
  });

  describe('updateService', () => {
    it(`should update a service from "${KAFKA_TOPICS.SERVICES_UPDATED}" kafka topic`, async () => {
      const service = {
        id: 'uuid',
        idCompany: 'uuid',
        name: 'foo',
        companyName: 'foo',
        companyAddress: 'foo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const payload = {
        value: service,
      };

      jest.spyOn(servicesService, 'updateService').mockResolvedValueOnce(null);

      const result = await servicesController.updateService(payload);

      expect(result).toBe(undefined);
      expect(servicesService.updateService).toBeCalledWith(service.id, {
        name: service.name,
        updatedAt: service.updatedAt,
      });
    });
  });

  describe('deleteService', () => {
    it(`should delete a service from "${KAFKA_TOPICS.SERVICES_DELETED}" kafka topic`, async () => {
      const service = {
        id: 'uuid',
        idCompany: 'uuid',
        name: 'foo',
        companyName: 'foo',
        companyAddress: 'foo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const payload = {
        value: service,
      };

      jest.spyOn(servicesService, 'deleteService').mockResolvedValueOnce(null);

      const result = await servicesController.deleteService(payload);

      expect(result).toBe(undefined);
      expect(servicesService.deleteService).toBeCalledWith(service.id);
    });
  });

  describe('createPeriod', () => {
    it(`should create a service period from "${KAFKA_TOPICS.SERVICE_PERIODS_CREATED}" kafka topic`, async () => {
      const servicePeriod = {
        id: 'uuid',
      };
      const payload = {
        value: servicePeriod,
      };

      jest.spyOn(servicesService, 'createPeriod').mockResolvedValueOnce(null);

      const result = await servicesController.createPeriod(payload);

      expect(result).toBe(undefined);
      expect(servicesService.createPeriod).toBeCalledWith(servicePeriod);
    });
  });

  describe('deletePeriod', () => {
    it(`should delete a service period from "${KAFKA_TOPICS.SERVICE_PERIODS_DELETED}" kafka topic`, async () => {
      const service = {
        id: 'uuid',
        idCompany: 'uuid',
        name: 'foo',
        companyName: 'foo',
        companyAddress: 'foo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const payload = {
        value: service,
      };

      jest.spyOn(servicesService, 'deletePeriod').mockResolvedValueOnce(null);

      const result = await servicesController.deletePeriod(payload);

      expect(result).toBe(undefined);
      expect(servicesService.deletePeriod).toBeCalledWith(service.id);
    });
  });
});
