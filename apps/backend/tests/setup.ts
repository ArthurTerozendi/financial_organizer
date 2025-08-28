import { config } from 'dotenv';

// Load environment variables for testing
config({ path: '.env.test' });

// Mock the database module
jest.mock('@financial-organizer/db', () => ({
  Db: {
    instance: {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      tag: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        createMany: jest.fn(),
      },
      transaction: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        createMany: jest.fn(),
        update: jest.fn(),
      },
      bankStatement: {
        create: jest.fn(),
      },
      $queryRaw: jest.fn(),
    },
  },
  Prisma: {
    PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
      code: string;
      constructor(message: string, code: string) {
        super(message);
        this.code = code;
      }
    },
  },
}));

// Global test setup
beforeEach(() => {
  jest.clearAllMocks();
});

// Global test teardown
afterAll(() => {
  jest.restoreAllMocks();
});
