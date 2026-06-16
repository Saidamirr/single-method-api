import { Controller, Get } from '@nestjs/common';
import { LocusService } from './locus.service';

@Controller('locus')
export class LocusController {
    constructor(private readonly locusService: LocusService) {}
    @Get()
    getLocus() {
        return this.locusService.findAll();
    }
}
