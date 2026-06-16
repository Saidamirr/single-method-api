import { ForbiddenException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { LocusSideload, LocusSortBy, SortOrder } from './dto/get-locus.dto';
import { Locus } from './entities/locus.entity';
import { LocusService } from './locus.service';

function makeQueryBuilder(rows = [{ id: 1, assemblyId: 'GRCh38' }]) {
  return {
    leftJoin: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(rows),
  };
}

describe('LocusService', () => {
  let service: LocusService;
  let qb: ReturnType<typeof makeQueryBuilder>;

  beforeEach(async () => {
    qb = makeQueryBuilder();

    const module = await Test.createTestingModule({
      providers: [
        LocusService,
        {
          provide: getRepositoryToken(Locus),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(qb),
          },
        },
      ],
    }).compile();

    service = module.get(LocusService);
  });

  it('returns loci for a basic GET /locus request', async () => {
    const rows = await service.findAll({}, { role: 'admin' });

    expect(rows).toEqual([{ id: 1, assemblyId: 'GRCh38' }]);
    expect(qb.skip).toHaveBeenCalledWith(0);
    expect(qb.take).toHaveBeenCalledWith(1000);
    expect(qb.leftJoin).not.toHaveBeenCalled();
  });

  it('filters by id and assemblyId', async () => {
    await service.findAll({ id: 10, assemblyId: 'GRCh37' }, { role: 'admin' });

    expect(qb.andWhere).toHaveBeenCalledWith('locus.id = :id', { id: 10 });
    expect(qb.andWhere).toHaveBeenCalledWith(
      'locus.assembly_id = :assemblyId',
      { assemblyId: 'GRCh37' },
    );
  });

  it('joins members for region and membership filters', async () => {
    await service.findAll(
      { regionId: 86118093, membershipStatus: 'active' },
      { role: 'admin' },
    );

    expect(qb.leftJoin).toHaveBeenCalledWith('locus.locusMembers', 'member');
    expect(qb.andWhere).toHaveBeenCalledWith('member.region_id = :regionId', {
      regionId: 86118093,
    });
    expect(qb.andWhere).toHaveBeenCalledWith(
      'member.membership_status = :membershipStatus',
      { membershipStatus: 'active' },
    );
  });

  it('sideloads locus members when admin asks for them', async () => {
    await service.findAll(
      { sideloading: LocusSideload.LocusMembers },
      { role: 'admin' },
    );

    expect(qb.leftJoinAndSelect).toHaveBeenCalledWith(
      'locus.locusMembers',
      'member',
    );
  });

  it('blocks sideloading for normal users', async () => {
    await expect(
      service.findAll(
        { sideloading: LocusSideload.LocusMembers },
        { role: 'normal' },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(qb.getMany).not.toHaveBeenCalled();
  });

  it('limits limited users to the allowed regions', async () => {
    await service.findAll({}, { role: 'limited' });

    expect(qb.leftJoin).toHaveBeenCalledWith('locus.locusMembers', 'member');
    expect(qb.andWhere).toHaveBeenCalledWith(
      'member.region_id IN (:...allowedRegionIds)',
      { allowedRegionIds: [86118093, 86696489, 88186467] },
    );

    const joinOrder = qb.leftJoin.mock.invocationCallOrder[0];
    const whereOrder = qb.andWhere.mock.invocationCallOrder[0];
    expect(joinOrder).toBeLessThan(whereOrder);
  });

  it('applies pagination and safe sorting', async () => {
    await service.findAll(
      {
        page: 2,
        limit: 25,
        sortBy: LocusSortBy.MemberCount,
        sortOrder: SortOrder.Desc,
      },
      { role: 'admin' },
    );

    expect(qb.skip).toHaveBeenCalledWith(25);
    expect(qb.take).toHaveBeenCalledWith(25);
    expect(qb.orderBy).toHaveBeenCalledWith('locus.member_count', 'DESC');
  });
});
