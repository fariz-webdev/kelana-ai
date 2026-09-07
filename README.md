# KelanaAI

AI-powered travel planning app built with **Next.js** (frontend) and **FastAPI** (backend). Uses **Amazon Bedrock** (Nova Lite) for itinerary generation and chat, **AWS Knowledge Base** for grounded Q&A, and **PostgreSQL** for persistence.

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | Next.js 16, React 19, TypeScript, Tailwind CSS  |
| Backend   | FastAPI, SQLAlchemy, Uvicorn, Python 3.11+      |
| Database  | PostgreSQL                                      |
| AI / ML   | Amazon Bedrock (amazon.nova-lite-v1:0)          |
| Auth      | JWT (PyJWT + bcrypt)                            |

---

## Project Structure

```
kelana-ai/
├── backend/
│   ├── main.py              # FastAPI app & all API routes
│   ├── database.py          # SQLAlchemy engine & session
│   ├── migrate.py           # SQL migration runner
│   ├── migrations/          # Numbered .sql migration files
│   ├── models/              # ORM models (User, Trip, Conversation)
│   ├── services/            # Business logic & AWS integrations
│   ├── requirements.txt
│   └── .env                 # Backend environment variables (see below)
└── frontend/
    ├── app/                 # Next.js App Router pages
    ├── components/          # Shared UI components
    ├── services/            # API client functions
    ├── package.json
    └── .env                 # Frontend environment variables (see below)
```

---

## Prerequisites

- Python 3.11+
- Node.js 20+
- PostgreSQL 15+ (local or cloud, e.g. Neon)
- AWS account with Bedrock access enabled (region: `ap-southeast-2` by default)

---

## Local Development

### 1. Clone the repo

```bash
git clone <repo-url>
cd kelana-ai
```

---

### 2. Backend setup

#### 2a. Create and activate a virtual environment

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
```

#### 2b. Install dependencies

```bash
pip install -r requirements.txt
```

#### 2c. Configure environment variables

Create `backend/.env` (copy the template below and fill in your values):

```env
# CORS — URL of the running frontend
FRONTEND_URL=http://localhost:3000

# PostgreSQL connection string
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>

# AWS credentials for Bedrock
AWS_ACCESS_KEY_ID=<your-access-key-id>
AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
AWS_BEARER_TOKEN_BEDROCK=<your-bedrock-bearer-token>   # optional; used by bedrock_service
AWS_REGION=ap-southeast-2

# Amazon Bedrock model
MODEL_ID=amazon.nova-lite-v1:0

# AWS Bedrock Knowledge Base
KNOWLEDGE_BASE_ID=<your-kb-id>
KNOWLEDGE_BASE_MODEL_ARN=arn:aws:bedrock:ap-southeast-2::foundation-model/amazon.nova-lite-v1:0

# JWT
JWT_SECRET_KEY=<a-long-random-secret>
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60
```

#### 2d. Run database migrations

```bash
python migrate.py
```

This creates the `schema_migrations` tracking table and applies all SQL files under `migrations/` in order.

#### 2e. Start the backend server

```bash
uvicorn main:app --reload --port 8000
```

The API is now available at `http://localhost:8000`.  
Interactive docs: `http://localhost:8000/docs`

---

### 3. Frontend setup

#### 3a. Install dependencies

```bash
cd ../frontend
npm install
```

#### 3b. Configure environment variables

Create `frontend/.env`:

```env
# URL of the running backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### 3c. Start the development server

```bash
npm run dev
```

The app is now available at `http://localhost:3000`.

---

## Database Migrations

Migrations live in `backend/migrations/` as numbered SQL files:

```
001_create_users.sql
002_add_user_id_to_trips.sql
003_create_conversations_and_messages.sql
004_add_title_to_conversations.sql
```

To add a new migration, create the next numbered file (e.g. `005_...sql`) and run:

```bash
python migrate.py
```

The runner skips already-applied migrations, so it is safe to run multiple times.

---

## Production Deployment

### Backend (e.g. AWS EC2, Railway, Render)

1. Set all environment variables from section 2c on the host (do **not** commit `.env` to git).
2. Use a production-grade database — e.g. [Neon](https://neon.tech) (PostgreSQL, serverless):
   ```env
   DATABASE_URL=postgresql://<user>:<password>@<neon-host>/<db>?sslmode=require&channel_binding=require
   ```
3. Run migrations:
   ```bash
   python migrate.py
   ```
4. Start with Uvicorn (or behind Gunicorn):
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```
   Or with Gunicorn for multi-worker production:
   ```bash
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```
5. Set `FRONTEND_URL` to your deployed frontend domain (for CORS):
   ```env
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

### Frontend (e.g. Vercel)

1. Push the `frontend/` directory (or the whole repo) to GitHub.
2. Import the project in [Vercel](https://vercel.com) and set the **Root Directory** to `frontend`.
3. Add the environment variable in the Vercel dashboard:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com
   ```
4. Deploy. Vercel runs `next build` automatically on each push.

---

## Environment Variable Reference

### Backend (`backend/.env`)

| Variable                       | Description                                              |
|--------------------------------|----------------------------------------------------------|
| `FRONTEND_URL`                 | Allowed CORS origin (frontend URL)                      |
| `DATABASE_URL`                 | PostgreSQL connection string                             |
| `AWS_ACCESS_KEY_ID`            | AWS IAM access key                                       |
| `AWS_SECRET_ACCESS_KEY`        | AWS IAM secret key                                       |
| `AWS_BEARER_TOKEN_BEDROCK`     | Optional Bedrock bearer token                            |
| `AWS_REGION`                   | AWS region for Bedrock (e.g. `ap-southeast-2`)           |
| `MODEL_ID`                     | Bedrock model ID (e.g. `amazon.nova-lite-v1:0`)          |
| `KNOWLEDGE_BASE_ID`            | AWS Bedrock Knowledge Base ID                            |
| `KNOWLEDGE_BASE_MODEL_ARN`     | Foundation model ARN used for KB retrieval               |
| `JWT_SECRET_KEY`               | Secret key for signing JWT tokens                        |
| `JWT_ALGORITHM`                | JWT algorithm (`HS256`)                                  |
| `JWT_EXPIRE_MINUTES`           | Token expiry in minutes                                  |

### Frontend (`frontend/.env`)

| Variable               | Description                         |
|------------------------|-------------------------------------|
| `NEXT_PUBLIC_API_URL`  | Base URL of the backend API         |

---

## API Overview

| Method | Endpoint                                         | Auth | Description                        |
|--------|--------------------------------------------------|------|------------------------------------|
| GET    | `/health`                                        | —    | Health check                       |
| POST   | `/api/v1/auth/register`                          | —    | Register a new user                |
| POST   | `/api/v1/auth/login`                             | —    | Login, returns JWT token           |
| GET    | `/api/v1/auth/me`                                | ✓    | Get current user profile           |
| GET    | `/api/v1/trips`                                  | ✓    | List user's trips                  |
| POST   | `/api/v1/trips`                                  | ✓    | Create trip + AI itinerary         |
| GET    | `/api/v1/trips/{id}`                             | ✓    | Get a specific trip                |
| PUT    | `/api/v1/trips/{id}`                             | ✓    | Update a trip                      |
| DELETE | `/api/v1/trips/{id}`                             | ✓    | Delete a trip                      |
| POST   | `/api/v1/ask`                                    | ✓    | Query Knowledge Base               |
| GET    | `/api/v1/conversations`                          | ✓    | List conversations                 |
| POST   | `/api/v1/conversations`                          | ✓    | Create a conversation              |
| PUT    | `/api/v1/conversations/{id}`                     | ✓    | Rename a conversation              |
| DELETE | `/api/v1/conversations/{id}`                     | ✓    | Delete a conversation              |
| GET    | `/api/v1/conversations/{id}/messages`            | ✓    | List messages in a conversation    |
| POST   | `/api/v1/conversations/{id}/messages`            | ✓    | Send a message (chat with AI)      |

Full interactive docs available at `/docs` when the backend is running.
