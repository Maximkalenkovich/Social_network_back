import { Controller, Post, Get, Param, Body, Delete, Patch } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post('article/:articleId')
    async addComment(@Param('articleId') articleId: string, @Body() createCommentDto: CreateCommentDto) {
        return this.commentService.addComment(+articleId, createCommentDto);
    }

    @Get('article/:articleId')
    async getComments(@Param('articleId') articleId: string) {
        return this.commentService.getCommentsForArticle(+articleId);
    }

    @Delete(':id')
    async deleteComment(@Param('id') id: string) {
        return this.commentService.deleteComment(+id);
    }

    @Patch(':id')
    async editComment(@Param('id') id: string, @Body() content: string) {
        return this.commentService.editComment(+id, content);
    }
}
