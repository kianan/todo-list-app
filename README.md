# Todo List API

## Overview
This project is a simple **Todo List API** built using **Node.js** and **Express**. The API allows users to create, read, update, and delete (CRUD) tasks from a MongoDB database.

## Features
- Create new todos
- Retrieve all todos or a specific todo
- Update existing todos
- Delete todos

## Technologies Used
- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for building the API.
- **MongoDB**: Database to store todos.
- **Mongoose**: ODM to interact with MongoDB.

## Setup Instructions

### Prerequisites
- **Node.js** and **npm** installed
- **MongoDB Atlas** or local MongoDB instance

### Installation
1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd todo-list-api
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory with your MongoDB connection string:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Run the server:
   ```sh
   npm run dev
   ```

5. The server should be running on `http://localhost:3000`.

## API Endpoints
- **GET /todos**: Retrieve all todos.
- **GET /todos/:id**: Retrieve a specific todo by ID.
- **POST /todos**: Create a new todo.
- **PUT /todos/:id**: Update an existing todo.
- **DELETE /todos/:id**: Delete a todo.

## License
This project is open-source and available under the [MIT License](LICENSE).

