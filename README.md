# Friend Management Application

A full-stack MERN application for managing friends, searching users, and getting friend recommendations.

## Features

- User Authentication (Sign up/Login)
- Search Users
- Add/Remove Friends
- Friend Requests Management
- Friend Recommendations based on mutual connections
- Responsive UI

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **State Management**: Redux Toolkit

## Project Structure

```
friend-management/
├── client/           # React frontend
└── server/           # Node.js backend
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## API Documentation

### Authentication Endpoints
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### User Endpoints
- GET /api/users/search - Search users
- GET /api/users/recommendations - Get friend recommendations

### Friend Endpoints
- POST /api/friends/request - Send friend request
- PUT /api/friends/accept - Accept friend request
- PUT /api/friends/reject - Reject friend request
- DELETE /api/friends/:id - Remove friend

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 