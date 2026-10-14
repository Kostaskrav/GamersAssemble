import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentManagementController } from './comment-management/comment-management.controller';

@Module({
	imports: [AuthModule],
	controllers: [CommentsController, CommentManagementController],
	providers: [CommentsService],
})
export class CommentsModule {}