import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { LocusMember } from './locus-member.entity';

@Entity({
  schema: 'rnacen',
  name: 'rnc_locus',
})
export class Locus {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'assembly_id' })
  assemblyId: string;

  @Column({ name: 'locus_name' })
  locusName: string;

  @Column({ name: 'public_locus_name' })
  publicLocusName: string;

  @Column()
  chromosome: string;

  @Column()
  strand: string;

  @Column({ name: 'locus_start' })
  locusStart: number;

  @Column({ name: 'locus_stop' })
  locusStop: number;

  @Column({ name: 'member_count' })
  memberCount: number;

  @OneToMany(() => LocusMember, (member) => member.locus)
  locusMembers: LocusMember[];
}