import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Locus } from './entities/locus.entity';
import { Repository } from 'typeorm';
import { GetLocusDto } from './dto/get-locus.dto';

@Injectable()
export class LocusService {
    constructor(
        @InjectRepository(Locus)
        private readonly locusRepository: Repository<Locus>,
    ) {}

    async findAll(dto: GetLocusDto) {
    const qb = this.locusRepository.createQueryBuilder('locus');

    if (dto.id) {
    qb.andWhere('locus.id = :id', {
        id: dto.id,
    });
    }

    if (dto.assemblyId) {
    qb.andWhere(
        'locus.assembly_id = :assemblyId',
        {
        assemblyId: dto.assemblyId,
        },
    );
    }

    const needsMemberJoin =
    dto.regionId ||
    dto.membershipStatus ||
    dto.sideloading === 'locusMembers';

    if (needsMemberJoin) {
        if (dto.sideloading === 'locusMembers') {
            qb.leftJoinAndSelect(
            'locus.locusMembers',
            'member',
            );
        } else {
            qb.leftJoin(
            'locus.locusMembers',
            'member',
            );
        }
    }

    if (dto.regionId) {
        qb.andWhere(
            'member.region_id = :regionId',
            {
            regionId: dto.regionId,
            },
        );
    }

    if (dto.membershipStatus) {
        qb.andWhere(
            'member.membership_status = :membershipStatus',
            {
            membershipStatus: dto.membershipStatus,
            },
        );
    }

    

    const page = dto.page || 1;
    const limit = dto.limit || 1000;
    qb.skip((page - 1) * limit);
    qb.take(limit);

    const sortableFields = [
        'id',
        'assemblyId',
        'memberCount',
    ];

    if (
        dto.sortBy &&
        sortableFields.includes(dto.sortBy)
    ) {
        const fieldMap = {
            id: 'locus.id',
            assemblyId: 'locus.assembly_id',
            memberCount: 'locus.member_count',
        };

        qb.orderBy(
            fieldMap[dto.sortBy],
            dto.sortOrder || 'ASC',
        );
    }

    return qb.getMany();

    
  }
 
}