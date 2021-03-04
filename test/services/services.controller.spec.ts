import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { KAFKA_CLIENTS } from '../../src/contants';
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
});
