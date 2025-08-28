import {
  getCountTransactionsGroupByTag,
  getTransactionsGroupByMonth,
} from '../../src/routes/dashboard/controller';
import { Db } from '@financial-organizer/db';
import { createMockRequest, createMockReply, createMockUser, createMockTag, createMockTransaction } from '../utils/test-helpers';

describe('Dashboard Controller', () => {
  const mockDb = Db.instance as jest.Mocked<typeof Db.instance>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCountTransactionsGroupByTag', () => {
    it('should return transactions grouped by tag', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockTag1 = createMockTag({ id: 'tag-1', name: 'Food', color: '#FF0000', userId: mockUser.id });
      const mockTag2 = createMockTag({ id: 'tag-2', name: 'Transport', color: '#00FF00', userId: mockUser.id });

      const mockTransactions = [
        createMockTransaction({ userId: mockUser.id, tagId: mockTag1.id, tag: mockTag1 }),
        createMockTransaction({ userId: mockUser.id, tagId: mockTag1.id, tag: mockTag1 }),
        createMockTransaction({ userId: mockUser.id, tagId: mockTag2.id, tag: mockTag2 }),
        createMockTransaction({ userId: mockUser.id, tagId: null, tag: null }),
      ];

      const mockRequest = createMockRequest({
        user: mockUser,
      });
      const mockReply = createMockReply();

      (mockDb.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      // Act
      await getCountTransactionsGroupByTag(mockRequest as any, mockReply as any);

      // Assert
      expect(mockDb.transaction.findMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        include: { tag: true },
      });
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        transactionsGrouped: {
          'tag-1': { count: 2, label: 'Food', color: '#FF0000' },
          'tag-2': { count: 1, label: 'Transport', color: '#00FF00' },
          other: { count: 1, label: 'Outros', color: '#21A805' },
        },
      });
    });

    it('should handle transactions without tags', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockTransactions = [
        createMockTransaction({ userId: mockUser.id, tagId: null, tag: null }),
        createMockTransaction({ userId: mockUser.id, tagId: null, tag: null }),
      ];

      const mockRequest = createMockRequest({
        user: mockUser,
      });
      const mockReply = createMockReply();

      (mockDb.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      // Act
      await getCountTransactionsGroupByTag(mockRequest as any, mockReply as any);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        transactionsGrouped: {
          other: { count: 2, label: 'Outros', color: '#21A805' },
        },
      });
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
      await getCountTransactionsGroupByTag(mockRequest as any, mockReply as any);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({ message: 'Erro desconhecido' });
    });

    it('should handle empty transactions list', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockRequest = createMockRequest({
        user: mockUser,
      });
      const mockReply = createMockReply();

      (mockDb.transaction.findMany as jest.Mock).mockResolvedValue([]);

      // Act
      await getCountTransactionsGroupByTag(mockRequest as any, mockReply as any);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        transactionsGrouped: {},
      });
    });
  });

  describe('getTransactionsGroupByMonth', () => {
    it('should return transactions grouped by month for the last 12 months', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockRequest = createMockRequest({
        user: mockUser,
      });
      const mockReply = createMockReply();

      const mockQueryResult = [
        { yearMonth: '2024-01', creditAmount: 1000, debitAmount: 500 },
        { yearMonth: '2024-02', creditAmount: 1500, debitAmount: 750 },
      ];

      (mockDb.$queryRaw as jest.Mock).mockResolvedValue(mockQueryResult);

      // Act
      await getTransactionsGroupByMonth(mockRequest as any, mockReply as any);

      // Assert
      expect(mockDb.$queryRaw).toHaveBeenCalled();
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        transactions: expect.arrayContaining([
          expect.objectContaining({
            yearMonth: expect.any(String),
            creditAmount: expect.any(Number),
            debitAmount: expect.any(Number),
          }),
        ]),
      });
    });

    it('should handle database errors', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockRequest = createMockRequest({
        user: mockUser,
      });
      const mockReply = createMockReply();

      (mockDb.$queryRaw as jest.Mock).mockRejectedValue(new Error('Database error'));

      // Act
      await getTransactionsGroupByMonth(mockRequest as any, mockReply as any);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({ message: 'Erro desconhecido' });
    });

    it('should return all 12 months even with no data', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockRequest = createMockRequest({
        user: mockUser,
      });
      const mockReply = createMockReply();

      (mockDb.$queryRaw as jest.Mock).mockResolvedValue([]);

      // Act
      await getTransactionsGroupByMonth(mockRequest as any, mockReply as any);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        transactions: expect.arrayContaining([
          expect.objectContaining({
            yearMonth: expect.any(String),
            creditAmount: 0,
            debitAmount: 0,
          }),
        ]),
      });
      // Should return exactly 12 months
      const response = (mockReply.send as jest.Mock).mock.calls[0][0];
      expect(response.transactions).toHaveLength(12);
    });

    it('should handle partial data for some months', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockRequest = createMockRequest({
        user: mockUser,
      });
      const mockReply = createMockReply();

      const mockQueryResult = [
        { yearMonth: '2024-01', creditAmount: 1000, debitAmount: 500 },
        { yearMonth: '2024-03', creditAmount: 2000, debitAmount: 1000 },
      ];

      (mockDb.$queryRaw as jest.Mock).mockResolvedValue(mockQueryResult);

      // Act
      await getTransactionsGroupByMonth(mockRequest as any, mockReply as any);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(200);
      const response = (mockReply.send as jest.Mock).mock.calls[0][0];
      expect(response.transactions).toHaveLength(12);
      
      // Find the months with data in the response (should match our mock query result)
      const january = response.transactions.find((t: any) => t.yearMonth === '2024-01');
      const march = response.transactions.find((t: any) => t.yearMonth === '2024-03');
      
      // Check that months with data have correct values
      expect(january).toBeDefined();
      expect(january?.creditAmount).toBe(1000);
      expect(january?.debitAmount).toBe(500);
      
      expect(march).toBeDefined();
      expect(march?.creditAmount).toBe(2000);
      expect(march?.debitAmount).toBe(1000);
      
      // Check that months without data have zero values
      const february = response.transactions.find((t: any) => t.yearMonth === '2024-02');
      const april = response.transactions.find((t: any) => t.yearMonth === '2024-04');
      
      expect(february).toBeDefined();
      expect(february?.creditAmount).toBe(0);
      expect(february?.debitAmount).toBe(0);
      
      expect(april).toBeDefined();
      expect(april?.creditAmount).toBe(0);
      expect(april?.debitAmount).toBe(0);
    });
  });
});
