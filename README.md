# API Tests Project

## Overview
API test automation project using Playwright. Tests cover various API endpoints and authentication flows.

## Test Coverage: 98.27%
- Total Tests: 59
- Passed: 57
- Failed: 1
- Skipped: 1
- 
# API Test Results

## Test Execution Overview

The following screenshots show the test results from the Allure Report for the executed API tests.

### Status Overview
![Allure Report Status](./assets/allure_status.png)

### Detailed Overview
(https://github.com/ValeriaSpektor/HW_QA.GURU_API_1/blob/105de23cec03861a310399d6c46a534283a6a9db/allure_overview.png)



## Key Test Categories
1. Smoke Tests
- GET /challenges - verify challenges list
- GET /todos - basic functionality
- OPTIONS /todos - verify allowed methods

2. CRUD Operations
- POST /todos - create todos
- GET /todos/{id} - read specific todo
- PUT /todos/{id} - update todos 
- DELETE /todos/{id} - delete todos

3. Validation Tests
- Title/description length validations
- Status field validations
- Extra fields validation

4. Content Type Tests 
- XML to JSON conversion
- JSON to XML conversion
- Mixed content type handling

5. Authentication Flow
- Basic auth token generation
- Bearer token authentication
- Secret note operations

## Setup and Running

# Install dependencies
npm install

# Run tests
npx playwright test

# Generate Allure report
npx allure generate allure-results --clean
npx allure open allure-report
