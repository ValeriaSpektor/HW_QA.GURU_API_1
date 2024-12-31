# API Test Automation Project

## Test Execution Overview

The following screenshots show the test results from the Allure Report for the executed API tests.

### Status Overview
![Allure Report Status](./images/allure_status.png)

### Detailed Overview
![Allure Report Overview](./images/allure_overview.png)


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
