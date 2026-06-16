export class GetLocusDto {
  id?: number;

  assemblyId?: string;

  regionId?: number;

  membershipStatus?: string;

  sideloading?: 'locusMembers';

  page?: number;

  limit?: number;

  sortBy?: string;

  sortOrder?: 'ASC' | 'DESC';
}