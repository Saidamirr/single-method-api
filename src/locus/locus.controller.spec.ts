import { Test } from '@nestjs/testing';
import { LocusController } from './locus.controller';
import { LocusService } from './locus.service';

describe('LocusController', () => {
  it('passes GET /locus query and user to the service', async () => {
    const loci = [{ id: 1, assemblyId: 'GRCh38' }];
    const service = {
      findAll: jest.fn().mockResolvedValue(loci),
    };

    const module = await Test.createTestingModule({
      controllers: [LocusController],
      providers: [{ provide: LocusService, useValue: service }],
    }).compile();

    const controller = module.get(LocusController);
    const query = { assemblyId: 'GRCh38' };
    const req = { user: { role: 'admin' } };

    await expect(controller.getLocus(req, query)).resolves.toEqual(loci);
    expect(service.findAll).toHaveBeenCalledWith(query, req.user);
  });
});
