import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Locus } from './entities/locus.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocusService {
  constructor(
    @InjectRepository(Locus)
    private readonly locusRepository: Repository<Locus>,
  ) {}

  findAll() {
    return this.locusRepository.find({
        take: 10,
    });
  }
 
}