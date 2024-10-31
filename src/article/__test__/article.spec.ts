import { ArticleService } from "../article.service";
import { Test, TestingModule } from "@nestjs/testing";
import { readFileSync, writeFileSync } from "fs-extra";
import { CreateArticleDto } from "../dto/create-article.dto";
import { UpdateArticleDto } from "../dto/update-article.dto";

jest.mock('fs');

describe('ArticleService', () => {
  let articleService: ArticleService;

  const mockArticles = [
    { id: 1, title: 'Article 1', content: 'Content 1', author: 'Author 1' },
    { id: 2, title: 'Article 2', content: 'Content 2', author: 'Author 2' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleService],
    }).compile();

    articleService = module.get<ArticleService>(ArticleService) as jest.Mocked<ArticleService>;

    // Мокаем чтение файла
    (readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockArticles));
    // Мокаем запись файла
    (writeFileSync as jest.Mock).mockImplementation(() => {});
  });

  describe('create', () => {
    it('should create a new article', () => {
      const createArticleDto: CreateArticleDto = {
        title: 'New Article',
        content: 'New Content',
        author: 'New Author',
      };

      const result = articleService.create(createArticleDto);

      expect(result).toEqual({
        id: expect.any(Number),
        ...createArticleDto,
      });

      // Проверяем, что writeFileSync был вызван
      expect(writeFileSync).toHaveBeenCalledWith(expect.any(String), expect.any(String));
    });
  });

  describe('findAll', () => {
    it('should return an array of articles', () => {
      const result = articleService.findAll();

      expect(result).toEqual(mockArticles);
      expect(readFileSync).toHaveBeenCalledWith(expect.any(String), 'utf8');
    });
  });

  describe('findOne', () => {
    it('should return a single article by id', () => {
      const result = articleService.findOne(1);

      expect(result).toEqual(mockArticles[0]);
      expect(readFileSync).toHaveBeenCalledWith(expect.any(String), 'utf8');
    });

    it('should return undefined if article not found', () => {
      const result = articleService.findOne(999);
      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update an article', () => {
      const updateArticleDto: UpdateArticleDto = { title: 'Updated Article' };
      const result = articleService.update(1, updateArticleDto);

      expect(result).toEqual({ id: 1, title: 'Updated Article', content: 'Content 1', author: 'Author 1' });
      expect(writeFileSync).toHaveBeenCalledWith(expect.any(String), expect.any(String));
    });

    it('should return undefined if article not found', () => {
      const result = articleService.update(999, { title: 'Does not matter' });
      expect(result).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove an article', () => {
      articleService.remove(1);
      expect(writeFileSync).toHaveBeenCalledWith(expect.any(String), JSON.stringify(mockArticles.filter(article => article.id !== 1), null, 2));
    });

    it('should not fail when trying to remove a non-existing article', () => {
      articleService.remove(999);
      expect(writeFileSync).toHaveBeenCalled();
    });
  });
});
