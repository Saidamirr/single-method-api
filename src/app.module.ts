import { Module } from '@nestjs/common';
import { LocusModule } from './locus/locus.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    LocusModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'hh-pgsql-public.ebi.ac.uk',
      port: 5432,
      username: 'reader',
      password: 'NWDMCE5xdipIjRrp',
      database: 'pfmegrnargs',
      schema: 'rnacen',

      autoLoadEntities: true,
      synchronize: false,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
