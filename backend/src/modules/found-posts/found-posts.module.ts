import { Module } from '@nestjs/common';
import { FoundPostsController } from './found-posts.controller';
import { FoundPostsService } from './found-posts.service';

@Module({
  controllers: [FoundPostsController],
  providers: [FoundPostsService],
  exports: [FoundPostsService],
})
export class FoundPostsModule {}
