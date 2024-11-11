# BLOG-APP-BACKEND
#### A RESTful API backend for a Blog App that provides a convenient and secure way to access and manage blog's data.

## Features
- User Registration
- User Login

## Technologies Used
- **Node.js**: JavaScript runtime for the backend server
- **Express.js**: Web framework for building the API
- **PostgreSQL**: Relational database used for storing data
- **Prisma**: ORM for interacting with the database
- **JWT (JSON Web Token)**: For user authentication and authorization via access and refresh tokens
- **Bcrypt.js**: For securely hashing and comparing passwords
- **Dotenv**: For loading environment variables from a .env file
- **Express-validator**: For input validation in the registration and login process

## Installation
Clone the repository:
- `git clone https://github.com/blog-app/backend`
- `cd backend`
### Install dependencies:
`npm install`
### Create a .env file:
Copy the .env.example file and rename it to .env
Set your environment variables, including PORT, JWT_SECRET, and REFRESH_TOKEN_SECRET:
- `PORT=3000`
- `DATABASE_URL=postgresql_db_url`
- `ACCESS_TOKEN_SECRET=your_access_token_secret`
- `REFRESH_TOKEN_SECRET=your_refresh_token_secret`
### Run the server:
`npm start` -
The server will start on the specified port (default is 3000)

## API Endpoints
| Method | Endpoint             | Description                       |
|--------|----------------------|-----------------------------------|
| POST   | `/api/auth/register` | Registers a new user              |
| POST   | `/api/auth/login`    | Logs in a user                    |
| POST   | `/api/auth/token`    | Refreshes an access token         |





