import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Post()
    create(@Body() createArticleDto) {
        return this.articleService.create(createArticleDto);
    }

    @Get()
    findAll() {
        return this.articleService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.articleService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateArticleDto) {
        return this.articleService.update(+id, updateArticleDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.articleService.remove(+id);
    }
}
