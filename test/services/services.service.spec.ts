import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ServicePeriodsEntity } from '../../src/services/service-periods.entity';
import { ServiceEntity } from '../../src/services/service.entity';
import { ServicesService } from '../../src/services/services.service';

describe('ServicesService', () => {
  let servicesService: ServicesService;
  let servicesRepository: Repository<ServiceEntity>;
  let servicePeriodsRepository: Repository<ServicePeriodsEntity>;

  const idService = 'uuid';

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
      const serviceEntity = new ServiceEntity();
      const servicePeriodsEntity = new ServicePeriodsEntity();
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
});
