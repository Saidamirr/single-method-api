import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Locus } from './locus.entity';

@Entity({
  schema: 'rnacen',
  name: 'rnc_locus_members',
})
export class LocusMember {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'urs_taxid' })
  ursTaxid: string;

  @Column({ name: 'region_id' })
  regionId: number;

  @Column({ name: 'membership_status' })
  membershipStatus: string;

  @ManyToOne(() => Locus, (locus) => locus.locusMembers)
  @JoinColumn({ name: 'locus_id' })
  locus: Locus;
}