import { getAllTags, createTag } from '../../src/routes/tag/controller';
import { Db } from '@financial-organizer/db';
import { createMockRequest, createMockReply, createMockUser, createMockTag } from '../utils/test-helpers';

describe('Tag Controller', () => {
  const mockDb = Db.instance as jest.Mocked<typeof Db.instance>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTags', () => {
    it('should return all tags for a user', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockTags = [
        createMockTag({ id: 'tag-1', name: 'Food', color: '#FF0000', userId: mockUser.id }),
        createMockTag({ id: 'tag-2', name: 'Transport', color: '#00FF00', userId: mockUser.id }),
        createMockTag({ id: 'tag-3', name: 'Entertainment', color: '#0000FF', userId: mockUser.id }),
      ];

      const mockRequest = createMockRequest({
        user: mockUser,
      });
      const mockReply = createMockReply();

      (mockDb.tag.findMany as jest.Mock).mockResolvedValue(mockTags);

      // Act
      await getAllTags(mockRequest as any, mockReply as any);

      // Assert
      expect(mockDb.tag.findMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
      });
      expect(mockReply.send).toHaveBeenCalledWith({ tags: mockTags });
    });

    it('should return empty array when user has no tags', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockRequest = createMockRequest({
        user: mockUser,
      });
      const mockReply = createMockReply();

      (mockDb.tag.findMany as jest.Mock).mockResolvedValue([]);

      // Act
      await getAllTags(mockRequest as any, mockReply as any);

      // Assert
      expect(mockDb.tag.findMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
      });
      expect(mockReply.send).toHaveBeenCalledWith({ tags: [] });
    });

    it('should handle database errors', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockRequest = createMockRequest({
        user: mockUser,
      });
      const mockReply = createMockReply();

      (mockDb.tag.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(getAllTags(mockRequest as any, mockReply as any)).rejects.toThrow('Database error');
    });
  });

  describe('createTag', () => {
    it('should create a new tag successfully', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockTag = createMockTag({
        id: 'new-tag-123',
        name: 'New Tag',
        color: '#FF5733',
        userId: mockUser.id,
      });

      const mockRequest = createMockRequest({
        user: mockUser,
        body: {
          name: 'New Tag',
          color: '#FF5733',
          id: 'new-tag-123',
        },
      });
      const mockReply = createMockReply();

      (mockDb.tag.create as jest.Mock).mockResolvedValue(mockTag);

      // Act
      await createTag(mockRequest as any, mockReply as any);

      // Assert
      expect(mockDb.tag.create).toHaveBeenCalledWith({
        data: {
          name: 'New Tag',
          color: '#FF5733',
          userId: mockUser.id,
          id: 'new-tag-123',
        },
      });
      expect(mockReply.send).toHaveBeenCalledWith({ tag: mockTag });
    });

    it('should create a tag without custom id', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockTag = createMockTag({
        name: 'Auto Generated Tag',
        color: '#00FF00',
        userId: mockUser.id,
      });

      const mockRequest = createMockRequest({
        user: mockUser,
        body: {
          name: 'Auto Generated Tag',
          color: '#00FF00',
        },
      });
      const mockReply = createMockReply();

      (mockDb.tag.create as jest.Mock).mockResolvedValue(mockTag);

      // Act
      await createTag(mockRequest as any, mockReply as any);

      // Assert
      expect(mockDb.tag.create).toHaveBeenCalledWith({
        data: {
          name: 'Auto Generated Tag',
          color: '#00FF00',
          userId: mockUser.id,
          id: undefined,
        },
      });
      expect(mockReply.send).toHaveBeenCalledWith({ tag: mockTag });
    });

    it('should handle missing required fields', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockRequest = createMockRequest({
        user: mockUser,
        body: {
          name: 'Incomplete Tag',
          // Missing color
        },
      });
      const mockReply = createMockReply();

      // Act
      await createTag(mockRequest as any, mockReply as any);

      // Assert
      expect(mockDb.tag.create).toHaveBeenCalledWith({
        data: {
          name: 'Incomplete Tag',
          color: undefined,
          userId: mockUser.id,
          id: undefined,
        },
      });
    });

    it('should handle database errors during tag creation', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockRequest = createMockRequest({
        user: mockUser,
        body: {
          name: 'Error Tag',
          color: '#FF0000',
        },
      });
      const mockReply = createMockReply();

      (mockDb.tag.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(createTag(mockRequest as any, mockReply as any)).rejects.toThrow('Database error');
    });

    it('should handle empty string values', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockTag = createMockTag({
        name: '',
        color: '',
        userId: mockUser.id,
      });

      const mockRequest = createMockRequest({
        user: mockUser,
        body: {
          name: '',
          color: '',
        },
      });
      const mockReply = createMockReply();

      (mockDb.tag.create as jest.Mock).mockResolvedValue(mockTag);

      // Act
      await createTag(mockRequest as any, mockReply as any);

      // Assert
      expect(mockDb.tag.create).toHaveBeenCalledWith({
        data: {
          name: '',
          color: '',
          userId: mockUser.id,
          id: undefined,
        },
      });
      expect(mockReply.send).toHaveBeenCalledWith({ tag: mockTag });
    });
  });
});
