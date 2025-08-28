import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  getLastFiveTransactions,
  uploadFile,
} from '../../src/routes/transaction/controller';
import { Db } from '@financial-organizer/db';
import { createMockRequest, createMockReply, createMockUser, createMockTag, createMockTransaction } from '../utils/test-helpers';

// Mock ofx-data-extractor
jest.mock('ofx-data-extractor');

describe('Transaction Controller', () => {
  const mockDb = Db.instance as jest.Mocked<typeof Db.instance>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTransactions', () => {
    it('should return all transactions for a user', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockTransactions = [
        createMockTransaction({ userId: mockUser.id }),
        createMockTransaction({ userId: mockUser.id, type: 'Debit' }),
      ];

      const mockRequest = createMockRequest({
        user: mockUser,
      });
      const mockReply = createMockReply();

      (mockDb.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      // Act
      await getAllTransactions(mockRequest as any, mockReply as any);

      // Assert
      expect(mockDb.transaction.findMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        include: {
          bankStatement: true,
          tag: true,
        },
      });
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({ transactions: mockTransactions });
    });

    it('should handle database errors', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockRequest = createMockRequest({
        user: mockUser,
      });
      const mockReply = createMockReply();

      (mockDb.transaction.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      // Act
      await getAllTransactions(mockRequest as any, mockReply as any);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({ message: 'Unknown error' });
    });
  });

  describe('createTransaction', () => {
    it('should create a new transaction with existing tag', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockTag = createMockTag({ userId: mockUser.id });
      const mockTransaction = createMockTransaction({ userId: mockUser.id, tagId: mockTag.id });

      const mockRequest = createMockRequest({
        user: mockUser,
        body: {
          description: 'Test Transaction',
          value: 100.50,
          type: 'Credit',
          date: '2024-01-15T10:00:00Z',
          tag: 'Test Tag',
        },
      });
      const mockReply = createMockReply();

      (mockDb.tag.findFirst as jest.Mock).mockResolvedValue(mockTag);
      (mockDb.transaction.create as jest.Mock).mockResolvedValue(mockTransaction);

      // Act
      await createTransaction(mockRequest as any, mockReply as any);

      // Assert
      expect(mockDb.tag.findFirst).toHaveBeenCalledWith({
        where: { name: 'Test Tag' },
      });
      expect(mockDb.transaction.create).toHaveBeenCalledWith({
        data: {
          description: 'Test Transaction',
          type: 'Credit',
          value: 100.50,
          tagId: mockTag.id,
          transactionDate: expect.any(String),
          userId: mockUser.id,
        },
      });
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({ transaction: mockTransaction });
    });

    it('should create a new transaction with new tag', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockTag = createMockTag({ userId: mockUser.id, name: 'New Tag' });
      const mockTransaction = createMockTransaction({ userId: mockUser.id, tagId: mockTag.id });

      const mockRequest = createMockRequest({
        user: mockUser,
        body: {
          description: 'Test Transaction',
          value: 100.50,
          type: 'Credit',
          date: '2024-01-15T10:00:00Z',
          tag: 'New Tag',
        },
      });
      const mockReply = createMockReply();

      (mockDb.tag.findFirst as jest.Mock).mockResolvedValue(null);
      (mockDb.tag.create as jest.Mock).mockResolvedValue(mockTag);
      (mockDb.transaction.create as jest.Mock).mockResolvedValue(mockTransaction);

      // Act
      await createTransaction(mockRequest as any, mockReply as any);

      // Assert
      expect(mockDb.tag.findFirst).toHaveBeenCalledWith({
        where: { name: 'New Tag' },
      });
      expect(mockDb.tag.create).toHaveBeenCalledWith({
        data: {
          name: 'New Tag',
          color: '#ef23ab',
          userId: mockUser.id,
        },
      });
      expect(mockDb.transaction.create).toHaveBeenCalledWith({
        data: {
          description: 'Test Transaction',
          type: 'Credit',
          value: 100.50,
          tagId: mockTag.id,
          transactionDate: expect.any(String),
          userId: mockUser.id,
        },
      });
    });

    it('should return 400 for invalid date', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockRequest = createMockRequest({
        user: mockUser,
        body: {
          description: 'Test Transaction',
          value: 100.50,
          type: 'Credit',
          date: 'invalid-date',
          tag: 'Test Tag',
        },
      });
      const mockReply = createMockReply();

      // Act
      await createTransaction(mockRequest as any, mockReply as any);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({ message: 'Date invalid' });
    });
  });

  describe('updateTransaction', () => {
    it('should update an existing transaction', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockTransaction = createMockTransaction({ userId: mockUser.id });
      const updatedTransaction = { ...mockTransaction, description: 'Updated Description' };

      const mockRequest = createMockRequest({
        user: mockUser,
        params: { id: 'transaction-123' },
        body: {
          description: 'Updated Description',
          value: 150.75,
          type: 'Debit',
          date: '2024-01-15T10:00:00Z',
          tag: 'Updated Tag',
        },
      });
      const mockReply = createMockReply();

      (mockDb.transaction.findUnique as jest.Mock).mockResolvedValue(mockTransaction);
      (mockDb.transaction.update as jest.Mock).mockResolvedValue(updatedTransaction);

      // Act
      await updateTransaction(mockRequest as any, mockReply as any);

      // Assert
      expect(mockDb.transaction.findUnique).toHaveBeenCalledWith({
        where: { id: 'transaction-123' },
      });
      expect(mockDb.transaction.update).toHaveBeenCalledWith({
        where: { id: 'transaction-123' },
        data: {
          description: 'Updated Description',
          type: 'Debit',
          value: 150.75,
          transactionDate: expect.any(String),
          tagId: 'Updated Tag',
        },
        include: {
          tag: true,
        },
      });
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({ transaction: updatedTransaction });
    });

    it('should return 404 when transaction not found', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockRequest = createMockRequest({
        user: mockUser,
        params: { id: 'nonexistent-transaction' },
        body: {
          description: 'Updated Description',
          value: 150.75,
          type: 'Debit',
          date: '2024-01-15T10:00:00Z',
          tag: 'Updated Tag',
        },
      });
      const mockReply = createMockReply();

      (mockDb.transaction.findUnique as jest.Mock).mockResolvedValue(null);

      // Act
      await updateTransaction(mockRequest as any, mockReply as any);

      // Assert
      expect(mockDb.transaction.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent-transaction' },
      });
      expect(mockReply.status).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({ message: 'Transaction not found' });
    });

    it('should handle null/empty tag', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockTransaction = createMockTransaction({ userId: mockUser.id });

      const mockRequest = createMockRequest({
        user: mockUser,
        params: { id: 'transaction-123' },
        body: {
          description: 'Updated Description',
          value: 150.75,
          type: 'Debit',
          date: '2024-01-15T10:00:00Z',
          tag: '',
        },
      });
      const mockReply = createMockReply();

      (mockDb.transaction.findUnique as jest.Mock).mockResolvedValue(mockTransaction);
      (mockDb.transaction.update as jest.Mock).mockResolvedValue(mockTransaction);

      // Act
      await updateTransaction(mockRequest as any, mockReply as any);

      // Assert
      expect(mockDb.transaction.update).toHaveBeenCalledWith({
        where: { id: 'transaction-123' },
        data: {
          description: 'Updated Description',
          type: 'Debit',
          value: 150.75,
          transactionDate: expect.any(String),
          tagId: null,
        },
        include: {
          tag: true,
        },
      });
    });
  });

  describe('getLastFiveTransactions', () => {
    it('should return last five transactions', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockTransactions = [
        createMockTransaction({ userId: mockUser.id }),
        createMockTransaction({ userId: mockUser.id, type: 'Debit' }),
      ];

      const mockRequest = createMockRequest({
        user: mockUser,
      });
      const mockReply = createMockReply();

      (mockDb.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      // Act
      await getLastFiveTransactions(mockRequest as any, mockReply as any);

      // Assert
      expect(mockDb.transaction.findMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        orderBy: { transactionDate: 'desc' },
        take: 5,
      });
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({ transactions: mockTransactions });
    });
  });

  describe('uploadFile', () => {
    it('should return 400 when no file is uploaded', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockRequest = createMockRequest({
        user: mockUser,
        file: jest.fn().mockResolvedValue(null),
      });
      const mockReply = createMockReply();

      // Act
      await uploadFile(mockRequest as any, mockReply as any);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({ error: 'Nenhum arquivo enviado' });
    });

    it('should return 400 for invalid OFX file', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockFile = {
        filename: 'test.ofx',
        toBuffer: jest.fn().mockResolvedValue(Buffer.from('invalid content')),
      };

      const mockRequest = createMockRequest({
        user: mockUser,
        file: jest.fn().mockResolvedValue(mockFile),
      });
      const mockReply = createMockReply();

      // Act
      await uploadFile(mockRequest as any, mockReply as any);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'Arquivo não parece ser um arquivo OFX válido',
      });
    });

    it('should handle OFX processing errors', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockFile = {
        filename: 'test.ofx',
        toBuffer: jest.fn().mockResolvedValue(Buffer.from('<OFX>invalid</OFX>')),
      };

      const mockRequest = createMockRequest({
        user: mockUser,
        file: jest.fn().mockResolvedValue(mockFile),
      });
      const mockReply = createMockReply();

      // Mock OFX processing to throw error
      const { Ofx } = require('ofx-data-extractor');
      Ofx.mockImplementation(() => ({
        toJson: jest.fn().mockImplementation(() => {
          throw new Error('OFX parsing error');
        }),
      }));

      // Act
      await uploadFile(mockRequest as any, mockReply as any);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'Erro ao processar arquivo OFX. Verifique se o arquivo está no formato correto.',
      });
    });
  });
});
