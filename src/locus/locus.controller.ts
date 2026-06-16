import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { LocusService } from './locus.service';
import { GetLocusDto } from './dto/get-locus.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Request } from 'express';
import { AuthUser } from '../auth/auth-user';

type AuthRequest = Request & {
  user: AuthUser;
};

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('locus')
export class LocusController {
  constructor(private readonly locusService: LocusService) {}

  @ApiOperation({
    summary: 'Get loci',
  })
  @Get()
  getLocus(@Req() req: AuthRequest, @Query() dto: GetLocusDto) {
    return this.locusService.findAll(dto, req.user);
  }
}
