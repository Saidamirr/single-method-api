import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum LocusSideload {
  LocusMembers = 'locusMembers',
}

export enum LocusSortBy {
  Id = 'id',
  AssemblyId = 'assemblyId',
  MemberCount = 'memberCount',
}

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC',
}

export class GetLocusDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assemblyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  regionId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  membershipStatus?: string;

  @ApiPropertyOptional({ enum: LocusSideload })
  @IsOptional()
  @IsEnum(LocusSideload)
  sideloading?: LocusSideload;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit?: number;

  @ApiPropertyOptional({ enum: LocusSortBy })
  @IsOptional()
  @IsEnum(LocusSortBy)
  sortBy?: LocusSortBy;

  @ApiPropertyOptional({ enum: SortOrder })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
