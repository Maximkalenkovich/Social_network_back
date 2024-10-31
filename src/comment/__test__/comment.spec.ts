
import { readFileSync, writeFileSync } from 'fs';
import { jest } from '@jest/globals';
import { CreateCommentDto } from "../dto/create-comment.dto";
import { CommentService } from "../comment.service";

jest.mock('fs');

describe('CommentService', () => {
  let commentService: CommentService;

  beforeEach(() => {
    commentService = new CommentService();
    jest.clearAllMocks();
  });

  it('should add a comment', async () => {
    const articleId = 1;
    const createCommentDto: CreateCommentDto = { content: 'Test comment', author: 'User1' };
    const existingComments = [];

    (readFileSync as jest.Mock).mockReturnValue(JSON.stringify(existingComments));

    const newComment = await commentService.addComment(articleId, createCommentDto);

    expect(newComment).toHaveProperty('id');
    expect(newComment.articleId).toBe(articleId);
    expect(newComment.content).toBe(createCommentDto.content);
    expect(newComment.author).toBe(createCommentDto.author);
    expect(newComment.createdAt).toBeDefined();
    expect(newComment.likes).toBe(0);

    // Ensure writeFileSync is called with the correct data
    expect(writeFileSync).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining(JSON.stringify([newComment], null, 2))
    );
  });

  it('should retrieve comments for a given article', async () => {
    const articleId = 1;
    const comments = [
      { id: 1, articleId: 1, content: 'Comment 1', author: 'User1' },
      { id: 2, articleId: 2, content: 'Comment 2', author: 'User2' },
    ];

    (readFileSync as jest.Mock).mockReturnValue(JSON.stringify(comments));

    const result = await commentService.getCommentsForArticle(articleId);

    expect(result).toHaveLength(1);
    expect(result[0].articleId).toBe(articleId);
  });

  it('should delete a comment', async () => {
    const comments = [
      { id: 1, articleId: 1, content: 'Comment 1', author: 'User1' },
      { id: 2, articleId: 1, content: 'Comment 2', author: 'User2' },
    ];

    (readFileSync as jest.Mock).mockReturnValue(JSON.stringify(comments));

    const response = await commentService.deleteComment(1);

    expect(response).toEqual({ message: 'Comment deleted successfully' });

    // Ensure writeFileSync is called with the updated comments
    expect(writeFileSync).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining(JSON.stringify([{ id: 2, articleId: 1, content: 'Comment 2', author: 'User2' }], null, 2))
    );
  });

  it('should edit a comment', async () => {
    const comments = [
      { id: 1, articleId: 1, content: 'Comment 1', author: 'User1' },
    ];

    (readFileSync as jest.Mock).mockReturnValue(JSON.stringify(comments));

    const updatedComment = await commentService.editComment(1, 'Updated Comment');

    expect(updatedComment).toEqual({ id: 1, articleId: 1, content: 'Updated Comment', author: 'User1' });

    // Ensure writeFileSync is called with the updated comments
    expect(writeFileSync).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining(JSON.stringify([{ id: 1, articleId: 1, content: 'Updated Comment', author: 'User1' }], null, 2))
    );
  });

  it('should return null if comment to edit does not exist', async () => {
    const comments = [
      { id: 1, articleId: 1, content: 'Comment 1', author: 'User1' },
    ];

    (readFileSync as jest.Mock).mockReturnValue(JSON.stringify(comments));

    const updatedComment = await commentService.editComment(2, 'This will not be found');

    expect(updatedComment).toBeNull();
  });
});
