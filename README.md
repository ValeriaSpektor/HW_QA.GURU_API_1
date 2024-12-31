# API Test Automation Project

## Test Results (December 31, 2024)
![Test Results](test-results.png)

### Overview
- **Total Tests**: 59
- **Pass Rate**: 98.27%
- **Duration**: 1m 17s

### Test Status
- ✅ Passed: 57 tests
- ❌ Failed: 1 test
- ⏭️ Skipped: 1 test

### Test Suite Breakdown
- API Tests: 57 passed, 1 failed, 1 skipped

### Critical Test Results
- Normal severity: 57 passed
- Critical severity: 1 failed

## Key Test Areas
1. Authentication
2. CRUD Operations
3. Content Type Validation
4. Status Code Validation 
5. Input Validation
6. Mixed Content Types

## Tech Stack
- Playwright
- JavaScript
- Allure Report
- Faker.js

## Running Tests

npm install
npx playwright test
npx allure generate allure-results --clean
npx allure open allure-report
