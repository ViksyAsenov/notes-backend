# Notes Backend app

This is the backend component of a [notes](https://notes-backend-kgd9.onrender.com) application built using Node.js, Express, and MongoDB with Mongoose. It provides API endpoints for managing user authentication and notes storage.

## Getting Started

These instructions will help you get the project up and running on your local machine for development and testing purposes.

## Prerequisites

Before you begin, ensure you have the following software and resources:

- Node.js
- MongoDB (accessible online)
- Git (for cloning the repository)

### Installation

1. **Clone the Repository:**
   :
     ```
     git clone https://github.com/ViksyAsenov/notes-backend
     ```

2. **Navigate to the project directory:**
   :
     ```
     cd notes-backend
     ```

3. **Install the required dependencies:**
   :
     ```
     npm install
     ```

4. **Create a `.env` file in the root directory and define the following environment variables:**
   :
```
PORT=3001 # Port on which the server will run
MONGODB_URI=your-online-mongodb-connection-string
SECRET=your-secret-key-for-jwt
```

## Running the Application

To start the application, run the following command:
```
npm start
```
The server will start on the port defined in your .env file.

## Frontend Integration
The frontend build is served using Express's static file serving. You can access the frontend by visiting `http://localhost:PORT` in your browser. Ensure that your frontend build is in a folder named `build` within your project directory.

# Login Controller

The login controller handles user authentication and login. It provides an endpoint for users to log in and obtain an authentication token.

## Endpoint

- **POST `/api/login`**

## Request

- The controller expects a POST request with the following JSON body:
  - `username`
  - `password`

## Response

- If the provided username and password are valid, the controller responds with a JSON object containing the following information:
  - `token`: A JSON Web Token (JWT) for authentication
  - `username`
  - `name`

- In case of invalid credentials, the controller responds with a 401 status code and an error message.

## Implementation

The login controller script uses the following libraries and components:
- `jsonwebtoken` for generating JWT tokens.
- `bcrypt` for password hashing and verification.
- Access to the MongoDB database through the `User` model.
- Configuration settings from `config.js`.

Here's a brief overview of how the login process works:
1. It first attempts to find a user with the provided username in the database.
2. If a user is found, it checks if the provided password matches the hashed password in the database.
3. If both conditions are met, it generates a JWT token for the user and sends it along with user details in the response.

# Notes Controller

The notes controller is responsible for managing notes, including creation, retrieval, update, and deletion. It provides various endpoints for working with notes.

## Endpoints

- **GET `/api/notes`**: Retrieve a list of all notes.

- **GET `/api/notes/:id`**: Retrieve a specific note by its unique ID.

- **POST `/api/notes`**: Create a new note.

- **PUT `/api/notes/:id`**: Update an existing note.

- **DELETE `/api/notes/:id`**: Delete a note.

## Implementation

The notes controller script uses the following components and features:

- Access to the MongoDB database through the `Note` model.
- Middleware `userExtractor` for user authentication and extraction.
- Authorization checks to ensure users can only modify their own notes.

Here's a brief overview of how each endpoint works:

- **GET `/api/notes`**: Fetches a list of all notes, populating the associated user details (username and name).

- **GET `/api/notes/:id`**: Retrieves a specific note by its ID, populating the associated user details (username and name). Responds with a 404 status if the note is not found.

- **POST `/api/notes`**: Creates a new note. The user is extracted from the request, and the note is associated with the user who created it.

- **PUT `/api/notes/:id`**: Updates an existing note by ID. It first checks if the user attempting to update the note is the owner. If not, a 401 unauthorized response is sent. If the user is the owner, the note is updated.

- **DELETE `/api/notes/:id`**: Deletes a note by ID, but only if the user attempting the deletion is the owner. If not, a 401 unauthorized response is sent.

# Testing Controller

The testing controller is designed for test and development purposes, allowing you to reset the database by deleting all notes and users.

## Endpoint

- **POST `/api/testing/reset`**: Resets the database by deleting all notes and users.

## Implementation

The testing controller script provides a single endpoint to reset the database. It is useful during development and testing to start with a clean slate.

- **POST `/api/testing/reset`**: Deletes all notes and users in the database, leaving it in an empty state. It responds with a 204 status code to indicate the successful reset.

This controller is typically used for development and testing and should not be exposed in a production environment.

# Users Controller

The users controller is responsible for managing user-related operations, including user creation and retrieval.

## Endpoints

- **GET `/api/users`**: Retrieve a list of all users, along with their associated notes

- **POST `/api/users`**: Create a new user.

## Implementation

The users controller script uses the following components and features:

- Access to the MongoDB database through the `User` model.
- Password hashing using `bcrypt` for user security.

Here's a brief overview of how each endpoint works:

- **GET `/api/users`**: Fetches a list of all users, populating their associated notes with content and importance. This provides insight into each user's notes.

- **POST `/api/users`**: Creates a new user. It expects a JSON body containing `username`, `name`, and `password`. Passwords must be hashed before storing them in the database, and a minimum password length check is applied to ensure security.



