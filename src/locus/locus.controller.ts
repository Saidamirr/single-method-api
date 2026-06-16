import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { LocusService } from './locus.service';
import { GetLocusDto } from './dto/get-locus.dto';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('locus')
export class LocusController {
    constructor(private readonly locusService: LocusService) {}
    @ApiOperation({
    summary: 'Get loci',
    })
    @Get()
    getLocus(
    @Req() req,
    @Query() dto: GetLocusDto,
    ) {
    return this.locusService.findAll(dto, req.user);
    }
}
