import { login } from '../../src/routes/login/controller';
import { Db } from '@financial-organizer/db';
import bcrypt from 'bcryptjs';
import { createMockRequest, createMockReply, createMockUser } from '../utils/test-helpers';

// Mock bcrypt
jest.mock('bcryptjs');

describe('Login Controller', () => {
  const mockDb = Db.instance as jest.Mocked<typeof Db.instance>;
  const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockRequest = createMockRequest({
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      });
      const mockReply = createMockReply();

      (mockDb.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      mockBcrypt.compareSync.mockReturnValue(true);

      // Act
      await login(mockRequest as any, mockReply as any);

      // Assert
      expect(mockDb.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(mockBcrypt.compareSync).toHaveBeenCalledWith('password123', mockUser.password);
      expect((mockRequest as any).jwt.sign).toHaveBeenCalledWith(
        {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        },
        { expiresIn: '7d' }
      );
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({ token: 'mock-jwt-token' });
    });

    it('should return 404 when user does not exist', async () => {
      // Arrange
      const mockRequest = createMockRequest({
        body: {
          email: 'nonexistent@example.com',
          password: 'password123',
        },
      });
      const mockReply = createMockReply();

      (mockDb.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Act
      await login(mockRequest as any, mockReply as any);

      // Assert
      expect(mockDb.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
      expect(mockReply.status).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'E-mail incorreto',
        status: 'NOT_FOUND',
      });
    });

    it('should return 404 when password is incorrect', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockRequest = createMockRequest({
        body: {
          email: 'test@example.com',
          password: 'wrongpassword',
        },
      });
      const mockReply = createMockReply();

      (mockDb.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      mockBcrypt.compareSync.mockReturnValue(false);

      // Act
      await login(mockRequest as any, mockReply as any);

      // Assert
      expect(mockDb.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(mockBcrypt.compareSync).toHaveBeenCalledWith('wrongpassword', mockUser.password);
      expect(mockReply.status).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Senha incorreta',
        status: 'BAD_REQUEST',
      });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const mockRequest = createMockRequest({
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      });
      const mockReply = createMockReply();

      (mockDb.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(login(mockRequest as any, mockReply as any)).rejects.toThrow('Database error');
    });
  });
});
