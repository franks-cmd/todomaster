# TodoMaster - Architecture Document

## Overview

TodoMaster is a full-featured todo application with user authentication, categories, priorities, search/filter, drag-and-drop reordering, and due date reminders. Built with React + Express + SQLite for a lightweight, zero-config database experience.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS 4 |
| State Management | React Context + useReducer |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Backend | Express.js + TypeScript |
| Database | SQLite (via better-sqlite3) |
| ORM | Drizzle ORM |
| Auth | JWT (jsonwebtoken) + bcryptjs |

## Directory Structure

```
test1/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   └── Select.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── todo/
│   │   │   │   ├── TodoItem.tsx
│   │   │   │   ├── TodoList.tsx
│   │   │   │   ├── TodoForm.tsx
│   │   │   │   ├── TodoFilters.tsx
│   │   │   │   └── TodoSortableList.tsx
│   │   │   ├── category/
│   │   │   │   ├── CategoryList.tsx
│   │   │   │   └── CategoryForm.tsx
│   │   │   └── auth/
│   │   │       ├── LoginForm.tsx
│   │   │       └── RegisterForm.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── hooks/
│   │   │   ├── useTodos.ts
│   │   │   ├── useCategories.ts
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── todoService.ts
│   │   │   └── categoryService.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── TodoContext.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── backend/
│   └── src/
│       ├── routes/
│       │   ├── auth.ts
│       │   ├── todos.ts
│       │   └── categories.ts
│       ├── controllers/
│       │   ├── authController.ts
│       │   ├── todoController.ts
│       │   └── categoryController.ts
│       ├── middleware/
│       │   └── auth.ts
│       ├── types/
│       │   └── index.ts
│       ├── index.ts
│       └── package.json
├── db/
│   ├── schema.ts
│   ├── index.ts
│   ├── migrate.ts
│   ├── seed.ts
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Database Schema

### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PK, autoincrement |
| email | TEXT | NOT NULL, UNIQUE |
| password_hash | TEXT | NOT NULL |
| name | TEXT | NOT NULL |
| created_at | TEXT | NOT NULL, DEFAULT current_timestamp |

### categories
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PK, autoincrement |
| name | TEXT | NOT NULL |
| color | TEXT | NOT NULL, DEFAULT '#6366f1' |
| user_id | INTEGER | NOT NULL, FK → users.id ON DELETE CASCADE |
| created_at | TEXT | NOT NULL, DEFAULT current_timestamp |

### todos
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PK, autoincrement |
| title | TEXT | NOT NULL |
| description | TEXT | DEFAULT '' |
| completed | INTEGER | NOT NULL, DEFAULT 0 (boolean: 0/1) |
| priority | TEXT | NOT NULL, DEFAULT 'medium' (enum: 'low', 'medium', 'high') |
| due_date | TEXT | NULL (ISO 8601 string) |
| sort_order | INTEGER | NOT NULL, DEFAULT 0 |
| category_id | INTEGER | NULL, FK → categories.id ON DELETE SET NULL |
| user_id | INTEGER | NOT NULL, FK → users.id ON DELETE CASCADE |
| created_at | TEXT | NOT NULL, DEFAULT current_timestamp |
| updated_at | TEXT | NOT NULL, DEFAULT current_timestamp |

### Relationships
- users has many todos (user_id FK)
- users has many categories (user_id FK)
- categories has many todos (category_id FK, nullable)
- todos belongs to users (user_id FK)
- todos optionally belongs to categories (category_id FK)

## API Contract

All endpoints return JSON. Auth-required endpoints need `Authorization: Bearer <token>` header.

### Authentication

#### POST /api/auth/register
- **Auth**: None
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```
- **Response (201)**:
```json
{
  "token": "jwt_token_string",
  "user": { "id": 1, "email": "user@example.com", "name": "John Doe" }
}
```
- **Error (400)**: `{ "error": "Email already exists" }`

#### POST /api/auth/login
- **Auth**: None
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response (200)**:
```json
{
  "token": "jwt_token_string",
  "user": { "id": 1, "email": "user@example.com", "name": "John Doe" }
}
```
- **Error (401)**: `{ "error": "Invalid credentials" }`

#### GET /api/auth/me
- **Auth**: Required
- **Response (200)**:
```json
{
  "user": { "id": 1, "email": "user@example.com", "name": "John Doe" }
}
```

### Todos

#### GET /api/todos
- **Auth**: Required
- **Query Params**: `?search=keyword&category=1&priority=high&completed=true`
- **Response (200)**:
```json
{
  "todos": [
    {
      "id": 1,
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "priority": "high",
      "due_date": "2026-03-20T00:00:00.000Z",
      "sort_order": 0,
      "category_id": 1,
      "category_name": "Shopping",
      "category_color": "#6366f1",
      "user_id": 1,
      "created_at": "2026-03-17T00:00:00.000Z",
      "updated_at": "2026-03-17T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/todos
- **Auth**: Required
- **Request Body**:
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "high",
  "due_date": "2026-03-20T00:00:00.000Z",
  "category_id": 1
}
```
- **Response (201)**:
```json
{
  "todo": { "id": 1, "title": "Buy groceries", "..." : "..." }
}
```

#### PUT /api/todos/:id
- **Auth**: Required
- **Request Body** (all fields optional):
```json
{
  "title": "Updated title",
  "description": "Updated desc",
  "priority": "low",
  "due_date": "2026-03-25T00:00:00.000Z",
  "category_id": 2,
  "completed": true
}
```
- **Response (200)**:
```json
{
  "todo": { "id": 1, "title": "Updated title", "..." : "..." }
}
```

#### DELETE /api/todos/:id
- **Auth**: Required
- **Response (200)**:
```json
{ "message": "Todo deleted" }
```

#### PATCH /api/todos/:id/toggle
- **Auth**: Required
- **Response (200)**:
```json
{
  "todo": { "id": 1, "completed": true, "..." : "..." }
}
```

#### PUT /api/todos/reorder
- **Auth**: Required
- **Request Body**:
```json
{
  "orderedIds": [3, 1, 2, 5, 4]
}
```
- **Response (200)**:
```json
{ "message": "Reorder successful" }
```

### Categories

#### GET /api/categories
- **Auth**: Required
- **Response (200)**:
```json
{
  "categories": [
    { "id": 1, "name": "Work", "color": "#ef4444", "user_id": 1, "created_at": "..." },
    { "id": 2, "name": "Personal", "color": "#6366f1", "user_id": 1, "created_at": "..." }
  ]
}
```

#### POST /api/categories
- **Auth**: Required
- **Request Body**:
```json
{
  "name": "Work",
  "color": "#ef4444"
}
```
- **Response (201)**:
```json
{
  "category": { "id": 1, "name": "Work", "color": "#ef4444", "user_id": 1, "created_at": "..." }
}
```

#### DELETE /api/categories/:id
- **Auth**: Required
- **Response (200)**:
```json
{ "message": "Category deleted" }
```

## Shared Types (TypeScript)

```typescript
// Priority enum
type Priority = 'low' | 'medium' | 'high';

// User (without password)
interface User {
  id: number;
  email: string;
  name: string;
}

// Auth response
interface AuthResponse {
  token: string;
  user: User;
}

// Todo
interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  due_date: string | null;
  sort_order: number;
  category_id: number | null;
  category_name?: string;
  category_color?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// Create/Update todo request
interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: Priority;
  due_date?: string | null;
  category_id?: number | null;
}

interface UpdateTodoRequest {
  title?: string;
  description?: string;
  priority?: Priority;
  due_date?: string | null;
  category_id?: number | null;
  completed?: boolean;
}

// Reorder request
interface ReorderRequest {
  orderedIds: number[];
}

// Category
interface Category {
  id: number;
  name: string;
  color: string;
  user_id: number;
  created_at: string;
}

interface CreateCategoryRequest {
  name: string;
  color?: string;
}

// Todo filters
interface TodoFilters {
  search?: string;
  category?: number;
  priority?: Priority;
  completed?: boolean;
}
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Backend server port | 3001 |
| JWT_SECRET | Secret key for JWT token signing | my-super-secret-key-change-in-production |
| DATABASE_PATH | Path to SQLite database file | ./data/todo.db |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |

## UI Design Guidelines

- Modern, clean design with Tailwind CSS
- Color scheme: Indigo primary (#6366f1), with priority colors: red (high), yellow (medium), green (low)
- Responsive layout: sidebar for categories on desktop, collapsible on mobile
- Cards for todo items with visual priority indicators
- Smooth drag-and-drop animations
- Toast notifications for actions (optional, can use simple alerts)
