import { singUp } from '../../src/routes/signUp/controller';
import { Db } from '@financial-organizer/db';
import bcrypt from 'bcryptjs';
import { createMockRequest, createMockReply } from '../utils/test-helpers';

// Mock bcrypt
jest.mock('bcryptjs');

describe('SignUp Controller', () => {
  const mockDb = Db.instance as jest.Mocked<typeof Db.instance>;
  const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('singUp', () => {
    it('should successfully create a new user with default tags', async () => {
      // Arrange
      const mockUser = {
        id: 'user-123',
        email: 'newuser@example.com',
        name: 'New User',
        password: 'hashedpassword',
        createdAt: new Date(),
      };

      const mockRequest = createMockRequest({
        body: {
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
        },
      });
      const mockReply = createMockReply();

      mockBcrypt.hash.mockResolvedValue('hashedpassword' as never);
      (mockDb.user.create as jest.Mock).mockResolvedValue(mockUser);
      (mockDb.tag.createMany as jest.Mock).mockResolvedValue({ count: 3 });

      // Act
      await singUp(mockRequest as any, mockReply as any);

      // Assert
      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockDb.user.create).toHaveBeenCalledWith({
        data: {
          email: 'newuser@example.com',
          name: 'New User',
          password: 'hashedpassword',
        },
      });
      expect(mockDb.tag.createMany).toHaveBeenCalledWith({
        data: [
          { name: 'Alimentação', color: '#E74C3C', userId: 'user-123' },
          { name: 'Transporte', color: '#FAD7A0', userId: 'user-123' },
          { name: 'Lazer', color: '#82E0AA', userId: 'user-123' },
        ],
      });
      expect(mockReply.status).toHaveBeenCalledWith(201);
      expect(mockReply.send).toHaveBeenCalledWith({ message: 'Novo usuário criado!' });
    });

    it('should handle duplicate email error (P2002)', async () => {
      // Arrange
      const mockRequest = createMockRequest({
        body: {
          name: 'New User',
          email: 'existing@example.com',
          password: 'password123',
        },
      });
      const mockReply = createMockReply();

      // Create a mock error that matches the expected structure
      const prismaError = {
        name: 'PrismaClientKnownRequestError',
        code: 'P2002',
        message: 'Unique constraint failed',
        meta: { target: ['email'] }
      };

      mockBcrypt.hash.mockResolvedValue('hashedpassword' as never);
      (mockDb.user.create as jest.Mock).mockRejectedValue(prismaError);

      // Act
      await singUp(mockRequest as any, mockReply as any);

      // Assert
      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockDb.user.create).toHaveBeenCalledWith({
        data: {
          email: 'existing@example.com',
          name: 'New User',
          password: 'hashedpassword',
        },
      });
      expect(mockReply.status).toHaveBeenCalledWith(409);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'Esse e-mail já está em uso',
        message: 'O e-mail que você forneceu já está associado a outra conta',
      });
    });

    it('should handle other Prisma errors', async () => {
      // Arrange
      const mockRequest = createMockRequest({
        body: {
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
        },
      });
      const mockReply = createMockReply();

      // Create a mock error that matches the expected structure
      const prismaError = {
        name: 'PrismaClientKnownRequestError',
        code: 'P2000',
        message: 'Other error',
        meta: {}
      };

      mockBcrypt.hash.mockResolvedValue('hashedpassword' as never);
      (mockDb.user.create as jest.Mock).mockRejectedValue(prismaError);

      // Act
      await singUp(mockRequest as any, mockReply as any);

      // Assert
      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockDb.user.create).toHaveBeenCalledWith({
        data: {
          email: 'newuser@example.com',
          name: 'New User',
          password: 'hashedpassword',
        },
      });
      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'Internal error',
        message: 'Unknown error',
      });
    });

    it('should handle generic errors', async () => {
      // Arrange
      const mockRequest = createMockRequest({
        body: {
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
        },
      });
      const mockReply = createMockReply();

      mockBcrypt.hash.mockResolvedValue('hashedpassword' as never);
      (mockDb.user.create as jest.Mock).mockRejectedValue(new Error('Generic error'));

      // Act
      await singUp(mockRequest as any, mockReply as any);

      // Assert
      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockDb.user.create).toHaveBeenCalledWith({
        data: {
          email: 'newuser@example.com',
          name: 'New User',
          password: 'hashedpassword',
        },
      });
      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'Internal error',
        message: 'Unknown error',
      });
    });

    it('should handle bcrypt hash errors', async () => {
      // Arrange
      const mockRequest = createMockRequest({
        body: {
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
        },
      });
      const mockReply = createMockReply();

      (mockBcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hash error'));

      // Act
      await singUp(mockRequest as any, mockReply as any);

      // Assert
      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'Internal error',
        message: 'Unknown error',
      });
    });
  });
});
