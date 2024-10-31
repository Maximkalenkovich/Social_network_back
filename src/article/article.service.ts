import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs-extra';

const ARTICLES_DB = './data/articles.json';

@Injectable()
export class ArticleService {
    private readArticles() {
        return JSON.parse(readFileSync(ARTICLES_DB, 'utf8'));
    }

    private writeArticles(data) {
        writeFileSync(ARTICLES_DB, JSON.stringify(data, null, 2));
    }

    create(createArticleDto) {
        const articles = this.readArticles();
        const newArticle = { id: Date.now(), ...createArticleDto };
        articles.push(newArticle);
        this.writeArticles(articles);
        return newArticle;
    }

    findAll() {
        return this.readArticles();
    }

    findOne(id: number) {
        return this.readArticles().find((article) => article.id === id);
    }

    update(id: number, updateArticleDto) {
        const articles = this.readArticles();
        const index = articles.findIndex((article) => article.id === id);
        if (index !== -1) {
            articles[index] = { ...articles[index], ...updateArticleDto };
            this.writeArticles(articles);
        }
        return articles[index];
    }

    remove(id: number) {
        let articles = this.readArticles();
        articles = articles.filter((article) => article.id !== id);
        this.writeArticles(articles);
    }
}
