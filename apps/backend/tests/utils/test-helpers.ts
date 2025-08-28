import { FastifyInstance } from 'fastify';
import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';

export interface MockUser {
  id: string;
  email: string;
  name: string;
  password: string;
}

export interface MockTag {
  id: string;
  name: string;
  color: string;
  userId: string;
}

export interface MockTransaction {
  id: string;
  description: string;
  value: number;
  type: 'Credit' | 'Debit';
  transactionDate: string;
  userId: string;
  tagId?: string | null;
  bankStatementId?: string;
  tag?: MockTag | null;
}

export const createMockUser = (overrides: Partial<MockUser> = {}): MockUser => ({
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  password: bcrypt.hashSync('password123', 10),
  ...overrides,
});

export const createMockTag = (overrides: Partial<MockTag> = {}): MockTag => ({
  id: 'tag-123',
  name: 'Test Tag',
  color: '#FF0000',
  userId: 'user-123',
  ...overrides,
});

export const createMockTransaction = (overrides: Partial<MockTransaction> = {}): MockTransaction => ({
  id: 'transaction-123',
  description: 'Test Transaction',
  value: 100.50,
  type: 'Credit',
  transactionDate: new Date().toISOString(),
  userId: 'user-123',
  ...overrides,
});

export const createMockRequest = (overrides: any = {}): Partial<FastifyRequest> => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  user: createMockUser(),
  jwt: {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
    verify: jest.fn().mockReturnValue(createMockUser()),
  },
  ...overrides,
});

export const createMockReply = (): Partial<FastifyReply> => {
  const reply: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    code: jest.fn().mockReturnThis(),
  };
  return reply;
};

export const createMockFastifyInstance = (): Partial<FastifyInstance> => ({
  post: jest.fn(),
  get: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  addSchema: jest.fn(),
  register: jest.fn(),
  authenticate: jest.fn(),
  ready: jest.fn(),
  listen: jest.fn(),
  close: jest.fn(),
});

export const mockJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTYzNTU5OTk5OSwiZXhwIjoxNjM2MjA0Nzk5fQ.mock-signature';

export const createAuthenticatedRequest = (overrides: any = {}): Partial<FastifyRequest> => ({
  ...createMockRequest(),
  headers: {
    authorization: `Bearer ${mockJwtToken}`,
  },
  user: createMockUser(),
  ...overrides,
});
