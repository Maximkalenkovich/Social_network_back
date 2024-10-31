import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs-extra';
import { CreateCommentDto } from './dto/create-comment.dto';

const COMMENTS_DB = './data/comments.json';

@Injectable()
export class CommentService {
    private readComments() {
        return JSON.parse(readFileSync(COMMENTS_DB, 'utf8'));
    }

    private writeComments(data) {
        writeFileSync(COMMENTS_DB, JSON.stringify(data, null, 2));
    }

    async addComment(articleId: number, createCommentDto: CreateCommentDto) {
        const comments = this.readComments();
        const newComment = {
            id: Date.now(),
            articleId,
            ...createCommentDto,
            createdAt: new Date().toISOString(),
            likes: 0,
        };
        comments.push(newComment);
        this.writeComments(comments);
        return newComment;
    }

    async getCommentsForArticle(articleId: number) {
        const comments = this.readComments();
        return comments.filter(comment => comment.articleId === articleId);
    }

    async deleteComment(id: number) {
        let comments = this.readComments();
        comments = comments.filter(comment => comment.id !== id);
        this.writeComments(comments);
        return { message: 'Comment deleted successfully' };
    }

    async editComment(id: number, content: string) {
        const comments = this.readComments();
        const comment = comments.find(c => c.id === id);
        if (comment) {
            comment.content = content;
            this.writeComments(comments);
            return comment;
        }
        return null;
    }
}
