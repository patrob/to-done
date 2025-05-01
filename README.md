# To Done

A modern task management application built with Next.js, Express, GraphQL, and MongoDB.

<img width="734" alt="image" src="https://github.com/user-attachments/assets/ee866c45-dfe4-44a2-a0cf-74c18fae71a2" />

## Tech Stack

### Frontend

- Next.js 14
- Apollo Client
- GraphQL
- TypeScript
- TailwindCSS
- Radix UI Components
- Shadcn/ui

### Backend

- Express
- Apollo Server
- MongoDB with Mongoose
- TypeScript
- GraphQL

## Prerequisites

- Node.js (v18 or later recommended)
- MongoDB installed locally or a MongoDB Atlas account
- Docker (optional, for containerized MongoDB)

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/probinson/to-done.git
cd to-done
```

2. Install dependencies:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:

Root directory (copy `.env.example` to `.env`):
```
# MongoDB Configuration
MONGO_CONTAINER_NAME=todone-mongodb
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=todonepass
MONGO_DATABASE=todone
MONGO_PORT=27017
MONGO_VOLUME_NAME=todone-mongodb-data
```

Backend directory (copy `.env.example` to `.env`):
```
PORT=4000
MONGODB_URI=mongodb://admin:todonepass@localhost:27017/todone?authSource=admin
NODE_ENV=development
```

Frontend directory (copy `.env.example` to `.env`):
```
NEXT_PUBLIC_GRAPHQL_URI=http://localhost:4000/graphql
```

You can copy each `.env.example` file to `.env` in their respective directories:

```bash
# In root directory
cp .env.example .env

# In backend directory
cp .env.example .env

# In frontend directory
cp .env.example .env
```

Then update the values as shown above. The default values are configured to work with the Docker MongoDB setup.

4. Start MongoDB:

Using Docker:

```bash
docker-compose up -d
```

5. Start the development servers:

In the backend directory:

```bash
npm run dev
```

In the frontend directory (new terminal):

```bash
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend GraphQL API: http://localhost:4000/graphql

## Development

- Frontend runs in development mode with hot reloading at `localhost:3000`
- Backend API runs at `localhost:4000` with GraphQL playground available at `/graphql`
- MongoDB runs on the default port `27017`

## Building for Production

Frontend:

```bash
cd frontend
npm run build
npm start
```

Backend:

```bash
cd backend
npm run build
npm start
```

## Project Structure

```
to-done/
├── frontend/           # Next.js frontend application
│   ├── app/           # App router pages
│   ├── components/    # React components
│   ├── lib/          # Utilities and configurations
│   └── types/        # TypeScript type definitions
│
└── backend/           # Express backend application
    ├── src/          # Source code
    │   ├── graphql/  # GraphQL schema and resolvers
    │   └── models/   # Mongoose models
    └── dist/         # Compiled TypeScript
```

