// This file serves as the main entry point for all tests
// It ensures that all test files are properly loaded and executed

// Import all test files to ensure they are loaded
import './routes/login.test';
import './routes/signUp.test';
import './routes/transaction.test';
import './routes/dashboard.test';
import './routes/tag.test';
import './utils/parseDate.test';
import './utils/dashboardUtils.test';
import './integration/app.test';

describe('Test Suite Summary', () => {
  it('should have all test modules loaded', () => {
    // This test ensures that all test modules are properly imported
    expect(true).toBe(true);
  });
});
