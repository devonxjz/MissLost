import { Module } from '@nestjs/common';
import { LostPostsController } from './lost-posts.controller';
import { LostPostsService } from './lost-posts.service';

@Module({
  controllers: [LostPostsController],
  providers: [LostPostsService],
  exports: [LostPostsService],
})
export class LostPostsModule {}
