# Apollo Green Solutions

A full-stack task and workspace management app with a Laravel REST API backend and a React + Vite frontend.

# Preview

<img width="2932" height="1598" alt="image" src="https://github.com/user-attachments/assets/e426ff65-2d52-441d-8e89-84abe0637a3b" />

## What this project does

Apollo Green Solutions provides:

- User registration and authentication
- Workspace creation and selection
- Task management inside workspaces
- Kanban-style task board with three status lanes: Open, In Progress, Completed
- Task creation, editing, deletion, and drag-and-drop status updates
- Task statistics including totals, in-progress count, high-priority count, and completion rate

## DataBase setup

> I used docker image for postgres and ran the database in it. All the fields are in .env.example, including name, password, port

1. I went with 3 tables for simplicity:
 - User
 - WorkSpaces
 - Tasks

> The relationship between them is like this:
User -> (1::M) -> Workspaces -> (1::M) -> Tasks

## Architecture

- `backend/` - Laravel 13 backend API and authentication layer
- `frontend/` - React 19 + Vite + TypeScript single-page application

The frontend communicates with the backend API at `http://127.0.0.1:8080/api` by default.

## Backend setup

1. Open a terminal and navigate to the backend folder:

```bash
cd backend
```

2. Install PHP dependencies:

```bash
composer install
```

3. Generate the application key:

```bash
php artisan key:generate
```

4. Run database migrations:

```bash
php artisan migrate
```

5. Start the backend server:

```bash
php artisan serve --port=8080
```

## Frontend setup

1. Open a second terminal and navigate to the frontend folder:

```bash
cd frontend
```

2. Install JavaScript dependencies:

```bash
npm install
```

3. Start the Vite development server:

```bash
npm run dev
```

4. Open the URL shown by Vite in your browser (usually `http://localhost:5173`).


## Run both frontend and backend together

Use two terminals:

- Terminal 1: run the Laravel API
- Terminal 2: run the React frontend

Once both are running, the frontend will call the backend API to authenticate users, load workspaces, and manage tasks.

## Notes

- The frontend uses `frontend/src/utils.ts` to define the API base URL.
- If you change the backend port, update the API base URL in the frontend.
- The backend uses Laravel authentication middleware for protected API routes.

## Useful commands

### Backend

```bash
cd backend
composer install
php artisan key:generate
php artisan migrate
php artisan serve --port=8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Additional info

- Backend requirements: PHP 8.3+, Composer
- Frontend requirements: Node.js, npm
- Backend routes are defined in `backend/routes/api.php`
- Frontend auth and task logic live in `frontend/src`


## Improvements

- We can add support for team members and can assign the task to different users
- LogOut flow can be improved, we can blacklist the tokens to make sure that they cant be used once logged out.
- Maybe whole application can be built with Optimistic UI (I implemented it at some places) for better user experience
