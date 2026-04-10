import { Module } from '@nestjs/common';
import { AiMatchesController } from './ai-matches.controller';
import { AiMatchesService } from './ai-matches.service';

@Module({
  controllers: [AiMatchesController],
  providers: [AiMatchesService],
  exports: [AiMatchesService],
})
export class AiMatchesModule {}
