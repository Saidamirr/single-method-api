import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Locus } from './entities/locus.entity';
import { Repository } from 'typeorm';
import { GetLocusDto, LocusSideload, SortOrder } from './dto/get-locus.dto';
import { AuthUser } from '../auth/auth-user';

const LIMITED_REGION_IDS = [86118093, 86696489, 88186467];

@Injectable()
export class LocusService {
  constructor(
    @InjectRepository(Locus)
    private readonly locusRepository: Repository<Locus>,
  ) {}

  async findAll(dto: GetLocusDto, user: Pick<AuthUser, 'role'>) {
    const qb = this.locusRepository.createQueryBuilder('locus');

    if (
      user.role === 'normal' &&
      dto.sideloading === LocusSideload.LocusMembers
    ) {
      throw new ForbiddenException('Sideloading not allowed');
    }

    const needsMemberJoin =
      user.role === 'limited' ||
      !!dto.regionId ||
      !!dto.membershipStatus ||
      dto.sideloading === LocusSideload.LocusMembers;

    if (dto.sideloading === LocusSideload.LocusMembers) {
      qb.leftJoinAndSelect('locus.locusMembers', 'member');
    } else if (needsMemberJoin) {
      qb.leftJoin('locus.locusMembers', 'member');
    }

    if (user.role === 'limited') {
      qb.andWhere('member.region_id IN (:...allowedRegionIds)', {
        allowedRegionIds: LIMITED_REGION_IDS,
      });
    }

    if (dto.id) {
      qb.andWhere('locus.id = :id', {
        id: dto.id,
      });
    }

    if (dto.assemblyId) {
      qb.andWhere('locus.assembly_id = :assemblyId', {
        assemblyId: dto.assemblyId,
      });
    }

    if (dto.regionId) {
      qb.andWhere('member.region_id = :regionId', {
        regionId: dto.regionId,
      });
    }

    if (dto.membershipStatus) {
      qb.andWhere('member.membership_status = :membershipStatus', {
        membershipStatus: dto.membershipStatus,
      });
    }

    const page = dto.page || 1;
    const limit = dto.limit || 1000;

    qb.skip((page - 1) * limit);
    qb.take(limit);

    const sortColumns = {
      id: 'locus.id',
      assemblyId: 'locus.assembly_id',
      memberCount: 'locus.member_count',
    };

    if (dto.sortBy) {
      qb.orderBy(sortColumns[dto.sortBy], dto.sortOrder || SortOrder.Asc);
    }

    return qb.getMany();
  }
}
