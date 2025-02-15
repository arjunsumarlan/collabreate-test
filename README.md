# Expense Tracker App for Collabreate Coding Test

A full-stack expense tracking application built with React Native (Expo) and Next.js.

## Project Structure

```
collabreate-test/
├── .expo/                 # Expo configuration
├── app/                   # Main application code
│   ├── (auth)/           # Authentication routes
│   └── (tabs)/           # Tab-based navigation routes
├── assets/               # Static assets
├── backend/              # Next.js API backend
│   ├── prisma/           # Database schema and migrations
│   └── src/              # Backend source code
├── components/           # Reusable React components
├── constants/            # App constants and configuration
├── hooks/                # Custom React hooks
├── prisma/               # Prisma configuration
├── scripts/              # Utility scripts
├── utils/                # Utility functions
└── node_modules/         # Dependencies
```

Key Directories:
- `app/`: Contains the main application routes and screens
- `backend/`: Houses the Next.js API server and database logic
- `components/`: Reusable UI components
- `hooks/`: Custom React hooks for shared logic
- `utils/`: Helper functions and API utilities

## Features

- User authentication
- Transaction management (add, view, delete)
- Expense vs Income visualization
- Time-based filtering (weekly, monthly, all-time)
- User profile management

## Backend Setup

The backend is built with Next.js and uses PostgreSQL with Prisma as the ORM.

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Docker and Docker Compose
- npm or yarn

### Local Database Setup

1. Start PostgreSQL using Docker Compose:
   ```bash
   cd backend
   docker-compose up -d
   ```

   This will start a PostgreSQL instance with the following configuration:
   - Port: 5432
   - Username: local
   - Password: password123
   - Database: transactions_db

2. Verify the database is running:
   ```bash
   docker ps
   ```

   You should see a running container for PostgreSQL.

### Backend Setup Steps

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env file
   cp .env.example .env
   ```

   The default configuration in .env.example should work with the Docker setup:
   ```env
   DATABASE_URL="postgresql://local:password123@localhost:5432/transactions_db?schema=public"
   JWT_SECRET="your-secret-key"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Seed the database:
   First, change "type" in package.json to "commonjs"
   ```json
   "type": "commonjs",
   ```
   Run the seed script
   ```bash
   npm run seed
   ```
   After seeding, change back to
   ```json
   "type": "module",
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The backend will be running on `http://localhost:3000`

## Frontend Setup

The frontend is built with React Native using Expo.

### Prerequisites

- Node.js (v18 or higher)
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Setup Steps

1. Navigate to the project root:
   ```bash
   cd collabreate-test
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env.development file
   cp .env.example .env.development
   ```

   Configure the API URL in .env.development:
   ```env
   EXPO_PUBLIC_API_URL=http://localhost:3000/api
   ```

   For physical devices, replace localhost with your computer's local IP address:
   ```env
   EXPO_PUBLIC_API_URL=http://192.168.1.xxx:3000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Run on your preferred platform:
   - Press `i` for iOS
   - Press `a` for Android
   - Scan QR code with Expo Go app for physical device

## Environment Setup

### Backend (.env)
```env
DATABASE_URL="postgresql://local:password123@localhost:5432/transactions_db?schema=public"
JWT_SECRET="your-secret-key"
```

### Frontend (.env.development)
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

Note: When testing on physical devices, replace localhost with your computer's local IP address.

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/summary` - Get transaction summary
- `DELETE /api/transactions/:id` - Delete a transaction

## Test Account

Use these credentials to test the application:
- Email: test@example.com
- Password: password123

## Development Notes

- The backend uses Next.js middleware for authentication
- JWT tokens are used for API authentication
- Transactions are user-specific
- The frontend uses AsyncStorage for token management
- Chart visualization uses react-native-chart-kit

## Common Issues

1. Seeding Error:
   - If you encounter seeding errors, make sure to change `"type": "module"` to `"type": "commonjs"` in backend/package.json
   - Run the seed script
   - Change back to `"type": "module"` to continue development

2. Authentication Issues:
   - Ensure JWT_SECRET is properly set in .env
   - Check token expiration (default 24h)
   - Verify Authorization header format

3. Database Connection:
   - Verify PostgreSQL is running
   - Check DATABASE_URL format
   - Ensure database exists

## Contributing

   1. Fork the repository
   2. Create your feature branch
   3. Commit your changes
   4. Push to the branch
   5. Create a Pull Request