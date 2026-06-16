import { ForbiddenException, Injectable } from '@nestjs/common';
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

    async findAll(dto: GetLocusDto, user: any) {
    const qb = this.locusRepository.createQueryBuilder('locus');

    if (user.role === 'limited') {
        qb.andWhere(
            'member.region_id IN (:...allowed)',
            {
            allowed: [
                86118093,
                86696489,
                88186467,
            ],
            },
        );
    }

    if (user.role === 'normal') {
    if (dto.sideloading === 'locusMembers') {
        throw new ForbiddenException(
        'Sideloading not allowed',
        );
    }
    }

    const joinMember =
    dto.regionId ||
    dto.membershipStatus ||
    dto.sideloading === 'locusMembers';

    const withSideloading = dto.sideloading === 'locusMembers';

    if (joinMember) {
    qb.leftJoin(
        'locus.locusMembers',
        'member',
    );

    if (withSideloading) {
        qb.addSelect(['member']);
    }
    }

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