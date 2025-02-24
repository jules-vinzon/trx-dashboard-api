<h1>TRX Dashboard API</h1>

The TRX Dashboard API is a backend service designed to manage and monitor transactions. It provides endpoints for retrieving transaction data, processing payments, and generating reports.

<h2>Table of Contents</h2>

- [Setup Instructions](#setup-instructions)
- [Architecture Overview](#architecture-overview)
- [Choice of Technologies and Reasoning](#choice-of-technologies-and-reasoning)
- [Assumptions Made](#assumptions-made)
- [Future Improvements](#future-improvements)
- [Testing Strategy and Core Component Identification](#testing-strategy-and-core-component-identification)

<h2>Setup Instructions</h2>
<h3>Prerequisites</h3>

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

<h2>Installation Steps</h2>

1. Clone the repository:
   ```sh
   git clone https://github.com/jules-vinzon/trx-dashboard-api.git
   cd trx-dashboard-api

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install

3. Configure environment variables:
- Copy the `.env.example` file and rename it to `.env.local`
- Fill in necessary environment variables (e.g., database connection, secret keys)

4. Start the development server:
   ```sh
   npm run dev
   # or
   yarn run dev

<h2>Architecture Overview</h2>

 The `trx-dashboard-api` follows a modular and service-oriented architecture with key components including:
 - **Express.js Framework**: Handles API requests and routing
 - **MongoDB Database**: Stores transaction data and user information
 - **JWT Authentication**: Secure API endpoints with user authentication
 - **MQTT Broker**: Handles real-time transaction updates

<h2>Choice of Technologies and Reasoning</h2>

| Technology | Purpose |
|----------|-----------------|
| Node.js  | Asynchronous, event-driven backend  |
| Express.js  | Lightweight and fast API framework  |
| MongoDB | NoSQL database for flexible data storage|
| JWT | Secure authentication mechanism |
| MQTT.js | Handling API requests |
| MQTT.js | Real-time communication protocol |
| Jest & Supertest | Testing framework for API reliability|

These choices ensure maintainability, scalability, and performance optimization.
 
<h2>Assumptions Made</h2>

- The frontend (`trx-dashboard-ui`) consumes this API
- API requests will include authentication where necessary
- Database is set up and accessible before running the API
- MQTT broker is properly configured for real-time updates

<h2>Future Improvements</h2>

- **Enhance authentication**: Implement OAuth2 and multi-factor authentication
- **Performance Optimizations**: Implement caching and database indexing
- **Unit & Integration Testing**: Expand test coverage for API endpoints
- **Logging and Monitoring**: Improve configuration for logs. Integrate tools if necessary.

<h2>Testing Strategy and Core Component Identification</h2>
<h3>Core Components Identified</h3>

- Authentication: Manages login, registration, and JWT handling
- Transactions: Handles CRUD operations for transactions
- MQTT Handler: Manages real-time updates from MQTT

<h4>Testing Approach</h4>

1. Unit Tests
   - Validate individual API functions and controllers
2. Integration Tests
   - Ensure API routes work with the database and return expected responses
3. End-to-End Tests
   - Simulate real-world API usage with authentication and transaction workflows

To run tests:

```sh
   npm run test
   # or
   yarn run test
