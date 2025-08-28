# Backend Test Suite

This directory contains comprehensive unit tests for the Financial Organizer backend API.

## Test Structure

```
tests/
├── setup.ts                    # Global test setup and mocks
├── utils/
│   └── test-helpers.ts         # Test utility functions and mock data
├── routes/
│   ├── login.test.ts           # Login endpoint tests
│   ├── signUp.test.ts          # Sign up endpoint tests
│   ├── transaction.test.ts     # Transaction endpoints tests
│   ├── dashboard.test.ts       # Dashboard endpoints tests
│   └── tag.test.ts             # Tag endpoints tests
├── utils/
│   ├── parseDate.test.ts       # Date parsing utility tests
│   └── dashboardUtils.test.ts  # Dashboard utility tests
├── integration/
│   └── app.test.ts             # Application integration tests
└── index.test.ts               # Main test entry point
```

## Running Tests

### Install Dependencies
```bash
pnpm install
```

### Run All Tests
```bash
pnpm test
```

### Run Tests in Watch Mode
```bash
pnpm test:watch
```

### Run Tests with Coverage
```bash
pnpm test:coverage
```

### Run Specific Test File
```bash
pnpm test -- login.test.ts
```

## Test Coverage

The test suite covers:

### Authentication & Authorization
- ✅ User login with valid/invalid credentials
- ✅ User registration with duplicate email handling
- ✅ JWT token generation and validation
- ✅ Password hashing and verification

### Transaction Management
- ✅ Create new transactions
- ✅ Update existing transactions
- ✅ Get all transactions for a user
- ✅ Get last 5 transactions
- ✅ OFX file upload and processing
- ✅ Transaction tagging and categorization

### Dashboard Analytics
- ✅ Transaction grouping by tags
- ✅ Monthly transaction summaries
- ✅ Data aggregation and formatting

### Tag Management
- ✅ Create new tags
- ✅ Get user tags
- ✅ Tag color and naming

### Utility Functions
- ✅ Date parsing in multiple formats
- ✅ Dashboard utility functions
- ✅ Error handling and edge cases

### Integration Tests
- ✅ Application startup and configuration
- ✅ Route registration
- ✅ CORS configuration
- ✅ Error handling middleware

## Test Patterns

### Mocking Strategy
- Database operations are mocked using Jest
- External dependencies (bcrypt, JWT, OFX parser) are mocked
- Request/Response objects are mocked for isolated testing

### Test Structure
Each test follows the AAA pattern:
- **Arrange**: Set up test data and mocks
- **Act**: Execute the function being tested
- **Assert**: Verify the expected outcomes

### Error Handling
- Tests cover both success and error scenarios
- Database errors are properly handled and tested
- Input validation is thoroughly tested

## Adding New Tests

1. Create a new test file in the appropriate directory
2. Follow the existing naming convention: `*.test.ts`
3. Import the necessary test utilities from `test-helpers.ts`
4. Use the established mocking patterns
5. Ensure comprehensive coverage of success and error cases

## Best Practices

- Use descriptive test names that explain the scenario being tested
- Group related tests using `describe` blocks
- Mock external dependencies to ensure isolated testing
- Test both happy path and error scenarios
- Use type-safe mock data with the provided interfaces
- Keep tests focused and avoid testing multiple concerns in a single test
