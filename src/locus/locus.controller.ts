import { Controller, Get, Query } from '@nestjs/common';
import { LocusService } from './locus.service';
import { GetLocusDto } from './dto/get-locus.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('locus')
export class LocusController {
    constructor(private readonly locusService: LocusService) {}
    @ApiOperation({
    summary: 'Get loci',
    })
    @Get()
    findAll( @Query() query: GetLocusDto) {
        return this.locusService.findAll(query);
    }
}
