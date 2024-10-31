import { Controller, Post, Param } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('likes')
export class LikeController {
    constructor(private readonly likeService: LikeService) {}

    @Post('article/:articleId')
    async likeArticle(@Param('articleId') articleId: string) {
        return this.likeService.likeArticle(+articleId);
    }

    @Post('comment/:commentId')
    async likeComment(@Param('commentId') commentId: string) {
        return this.likeService.likeComment(+commentId);
    }
}
