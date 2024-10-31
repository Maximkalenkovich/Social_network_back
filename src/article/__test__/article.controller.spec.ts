import { ArticleController } from "../article.controller";
import { ArticleService } from "../article.service";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateArticleDto } from "../dto/create-article.dto";
import { UpdateArticleDto } from "../dto/update-article.dto";

describe('ArticleController', () => {
  let articleController: ArticleController;
  let articleService: ArticleService;

  const mockArticleService = {
    create: jest.fn((dto: CreateArticleDto) => ({
      id: Date.now(), // Эмулируем идентификатор
      ...dto,
    })),
    findAll: jest.fn(() => [
      { id: 1, title: 'Article 1', content: 'Content 1', author: 'Author 1' },
      { id: 2, title: 'Article 2', content: 'Content 2', author: 'Author 2' },
    ]),
    findOne: jest.fn((id: number) => ({
      id,
      title: `Article ${id}`,
      content: `Content ${id}`,
      author: `Author ${id}`,
    })),
    update: jest.fn((id: number, dto: UpdateArticleDto) => ({
      id,
      ...dto,
    })),
    remove: jest.fn((id: number) => ({ deleted: true, id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        {
          provide: ArticleService,
          useValue: mockArticleService,
        },
      ],
    }).compile();

    articleController = module.get<ArticleController>(ArticleController) as unknown as ArticleController;
    articleService = module.get<ArticleService>(ArticleService) as unknown as ArticleService;
  });

  describe('create', () => {
    it('should create a new article', () => {
      const createArticleDto: CreateArticleDto = {
        title: 'New Article',
        content: 'New Content',
        author: 'New Author',
      };
      expect(articleController.create(createArticleDto)).toEqual({
        id: expect.any(Number),
        ...createArticleDto,
      });
      expect(articleService.create).toHaveBeenCalledWith(createArticleDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of articles', () => {
      expect(articleController.findAll()).toEqual([
        { id: 1, title: 'Article 1', content: 'Content 1', author: 'Author 1' },
        { id: 2, title: 'Article 2', content: 'Content 2', author: 'Author 2' },
      ]);
      expect(articleService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single article', () => {
      const id = 1;
      expect(articleController.findOne(id.toString())).toEqual({
        id,
        title: 'Article 1',
        content: 'Content 1',
        author: 'Author 1',
      });
      expect(articleService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update an article', () => {
      const id = 1;
      const updateArticleDto: UpdateArticleDto = { title: 'Updated Article' };
      expect(articleController.update(id.toString(), updateArticleDto)).toEqual({
        id,
        ...updateArticleDto,
      });
      expect(articleService.update).toHaveBeenCalledWith(id, updateArticleDto);
    });
  });

  describe('remove', () => {
    it('should remove an article', () => {
      const id = 1;
      expect(articleController.remove(id.toString())).toEqual({
        deleted: true,
        id,
      });
      expect(articleService.remove).toHaveBeenCalledWith(id);
    });
  });
});