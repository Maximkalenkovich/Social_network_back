import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs-extra';

const LIKES_DB = './data/likes.json';
const ARTICLES_DB = './data/articles.json';
const COMMENTS_DB = './data/comments.json';

@Injectable()
export class LikeService {
    private readLikes() {
        return JSON.parse(readFileSync(LIKES_DB, 'utf8'));
    }

    private writeLikes(data) {
        writeFileSync(LIKES_DB, JSON.stringify(data, null, 2));
    }

    private updateArticleLikes(articleId: number) {
        const articles = JSON.parse(readFileSync(ARTICLES_DB, 'utf8'));
        const article = articles.find(a => a.id === articleId);
        if (article) article.likes += 1;
        writeFileSync(ARTICLES_DB, JSON.stringify(articles, null, 2));
    }

    private updateCommentLikes(commentId: number) {
        const comments = JSON.parse(readFileSync(COMMENTS_DB, 'utf8'));
        const comment = comments.find(c => c.id === commentId);
        if (comment) comment.likes += 1;
        writeFileSync(COMMENTS_DB, JSON.stringify(comments, null, 2));
    }

    async likeArticle(articleId: number) {
        const likes = this.readLikes();
        likes.push({ id: Date.now(), articleId, createdAt: new Date().toISOString() });
        this.writeLikes(likes);
        this.updateArticleLikes(articleId);
        return { message: 'Article liked successfully' };
    }

    async likeComment(commentId: number) {
        const likes = this.readLikes();
        likes.push({ id: Date.now(), commentId, createdAt: new Date().toISOString() });
        this.writeLikes(likes);
        this.updateCommentLikes(commentId);
        return { message: 'Comment liked successfully' };
    }
}
