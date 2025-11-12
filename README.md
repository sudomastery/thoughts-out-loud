# Thoughts Out Loud – Engineering Guidelines

> Principal Engineer Guidance for a lightweight Twitter‑style platform (Flask + React)

## 1. Mission & Pitch Summary
Thoughts Out Loud is a minimal, developer‑friendly social platform for experimenting with core social media concepts (accounts, follows, posts, likes, hashtags) without heavy ranking algorithms. Target users: software engineering students learning full‑stack patterns.

## 2. High‑Level Architecture
Monorepo with two top‑level folders:
- `backend/` – Flask REST API (stateless), PostgreSQL via SQLAlchemy, JWT auth.
- `frontend/` – React (Vite) SPA consuming the API. TailwindCSS + Flowbite React planned.

Communication: JSON over HTTPS using REST conventions. Auth: Bearer token (JWT) stored in memory (e.g. React state) not in localStorage for security (optionally rotate refresh token via httpOnly cookie – stretch).

```
Client (React) -> REST API (Flask) -> PostgreSQL
                          |-> (future) Redis cache for trending hashtags
```

## 3. Backend Planned Structure
```
backend/
  app/
    __init__.py          # Flask app factory, extensions init
    config.py            # Settings (env driven)
    extensions.py        # db, migrate, jwt instances
    models/              # SQLAlchemy models
      user.py
      post.py
      follow.py          # association table / model
      like.py
      hashtag.py
      post_hashtag.py    # m2m link
      __init__.py
    api/                 # Blueprints grouped by domain
      auth.py            # /auth endpoints (signup, login, logout)
      users.py           # /users endpoints (profile, search)
      posts.py           # /posts CRUD, feed, likes
      hashtags.py        # /hashtags CRUD, trending
      __init__.py
    services/            # Pure business logic helpers
      auth_service.py
      post_service.py
      user_service.py
      hashtag_service.py
    schemas/             # Marshmallow/Pydantic schemas (validation/serialization)
      auth.py
      user.py
      post.py
      hashtag.py
      common.py
    utils/               # Helpers (password hashing, pagination, time)
      security.py
      pagination.py
    middleware/          # (Optional) request logging, rate limiting
    errors.py            # Central error handlers & custom exceptions
  migrations/            # Alembic migration scripts
  tests/                 # pytest tests
    unit/
    integration/
    e2e/
  wsgi.py                # Entry point for production servers (gunicorn)
  manage.py              # CLI for dev tasks (seed, create-admin)
  (requirements listed in README)   # Python deps
  (.env keys listed in README)      # Sample environment vars
```

### 3.1 App Factory Pattern
Use `create_app(config_name)` in `app/__init__.py` to allow test isolation and differing configs (Dev/Test/Prod).

### 3.2 Configuration & Environments
Environment variables drive config (12‑Factor):
- `FLASK_ENV` (development|production|test)
- `DATABASE_URL` (PostgreSQL connection string)
- `JWT_SECRET_KEY`
- `SECRET_KEY`
- `PAGE_SIZE_DEFAULT`

Provide defaults in `config.py` but never hardcode secrets.

### 3.3 Models (Initial Fields)
- User: id, username (unique), email (unique), password_hash, bio, created_at
- Post: id, user_id (FK), body (text), created_at, updated_at
- Follow: follower_id, followed_id, created_at (composite PK)
- Like: user_id, post_id, created_at (composite PK)
- Hashtag: id, name (unique, lowercase), created_at
- PostHashtag: post_id, hashtag_id (composite PK)

### 3.4 API Endpoint Outline (MVP + Stretch)
Auth:
- POST `/auth/signup` – create account
- POST `/auth/login` – obtain JWT
- POST `/auth/logout` – (optional, blacklist handling if using refresh)

Users:
- GET `/users/me` – current profile
- GET `/users/:username` – public profile
- GET `/users` – search by `?q=`
- POST `/users/follow/:username` – follow
- DELETE `/users/follow/:username` – unfollow

Posts:
- GET `/posts/feed` – aggregated feed (paginate)
- POST `/posts` – create post
- GET `/posts/:id` – read
- PUT `/posts/:id` – edit (owner only)
- DELETE `/posts/:id` – delete (owner only)
- POST `/posts/:id/like` – like
- DELETE `/posts/:id/like` – unlike

Hashtags:
- GET `/hashtags/trending` – (stretch; counts in last N hours)
- GET `/hashtags/:name` – posts tagged (paginate)
- POST `/hashtags` – create (auto-extract from post body MVP alternative)

Admin (Stretch):
- GET `/admin/users` – list with stats
- DELETE `/admin/users/:id` – remove user

### 3.5 Response & Error Conventions
Successful response envelope (consistent client handling):
```
{ "data": <payload>, "meta": { "page": 1, "page_size": 20, "total": 53 } }
```
Errors:
```
{ "error": { "code": "VALIDATION_ERROR", "message": "Username required", "details": {"field": "username"} } }
```
HTTP status usage: 200 OK, 201 Created, 204 No Content, 400 Validation, 401 Auth, 403 Forbidden, 404 Not Found, 409 Conflict (duplicate), 422 Unprocessable (semantic), 500/503 Server.

### 3.6 Validation
Use Marshmallow or Pydantic for request body validation. Sanitize/trim text, enforce length constraints (e.g. post body <= 280 chars by design choice). Convert hashtags to lowercase, strip `#` prefix.

### 3.7 Auth & Security
- Password hashing: `werkzeug.security` or `passlib` (bcrypt).
- JWT access token short expiry (15m) + optional refresh token (stretch) httpOnly cookie.
- Rate limiting (stretch): e.g. `flask-limiter` on write endpoints.
- CORS: restrict origins to frontend dev/prod domains.

### 3.8 Pagination
Query params: `?page=1&page_size=20` with sane maximum (e.g. 50). Use helper in `utils/pagination.py` returning items + counts.

### 3.9 Testing Strategy
Pytest layers:
- Unit: services & utils (no DB or with in-memory sqlite)
- Integration: API endpoints against test DB
- E2E: happy path flows (signup -> create post -> like -> feed)
Fixtures for test app and seeded users.
Aim for fast feedback (<2s unit, <5s integration for MVP size).

## 4. Frontend Planned Structure
Current files exist; to expand:
```
frontend/
  src/
    api/               # Fetch wrappers (axios/fetch) + endpoint modules
      client.js        # Configured fetch/axios instance
      auth.js
      users.js
      posts.js
      hashtags.js
    components/        # Reusable UI units
      layout/
        NavBar.jsx
        Sidebar.jsx
      feed/
        PostCard.jsx
        NewPostForm.jsx
      user/
        ProfileHeader.jsx
      common/
        Button.jsx
        Spinner.jsx
    pages/             # Route-level components
      FeedPage.jsx
      LoginPage.jsx
      SignupPage.jsx
      ProfilePage.jsx
      HashtagPage.jsx
    hooks/             # Custom hooks (auth, pagination, form)
      useAuth.js
      useFeed.js
    context/           # React Context providers
      AuthProvider.jsx
    styles/            # Tailwind config overrides / global styles
    utils/             # Pure helpers (formatTime, extractHashtags)
    router.jsx         # Central route definitions (react-router)
  tailwind.config.js   # Tailwind setup (to add)
```

### 4.1 State Management
Prefer lightweight approach first: React Context + hooks. If complexity grows (cache normalization), consider TanStack Query for server state and keep auth/local state in context.

### 4.2 Data Fetching Pattern
Each `api/*.js` exports functions returning promises; wrap fetch errors into a unified error object consumed by UI. Implement retry (limited) for transient 5xx.

### 4.3 Styling
Adopt TailwindCSS + Flowbite React for speed. Keep component classNames readable; extract conditional variants into small helper functions if needed.

### 4.4 Error & Loading UX
Global error boundary for unexpected errors. Each page shows skeleton or spinner while loading. Toast system for transient success/error messages.

## 5. Naming & Conventions
- Python: snake_case functions, PascalCase models, ALL_CAPS constants.
- JavaScript: camelCase functions/vars, PascalCase React components, UPPER_SNAKE for config constants.
- Commit messages: Conventional Commits (e.g. `feat: add like endpoint`).
- Branches: `feature/<short-name>`, `fix/<issue>`, `chore/<task>`.
- API paths: plural nouns, action verbs only when needed (`/auth/login`).
- Avoid abbreviations; keep readability high.

## 6. Environment & Setup
Backend dev commands (planned):
```
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
flask --app backend/app run --debug
```
Front end dev:
```
cd frontend
npm install
npm run dev
```
Environment parity: Use `.env` for local; production uses actual environment variables.

### 6.1 Backend dependencies (requirements.txt)
Copy into `backend/requirements.txt`:

```
# --- Core web ---
Flask>=3.0,<4.0
Flask-Cors>=4.0,<5.0

# --- Database / ORM ---
SQLAlchemy>=2.0,<3.0
Flask-SQLAlchemy>=3.1,<4.0
Flask-Migrate>=4.0,<5.0
psycopg[binary]>=3.1,<4.0  # PostgreSQL driver (psycopg3)

# --- Auth & Security ---
Flask-JWT-Extended>=4.6,<5.0
passlib[bcrypt]>=1.7,<2.0
python-dotenv>=1.0,<2.0

# --- Validation / Serialization ---
marshmallow>=3.21,<4.0

# --- Production server ---
gunicorn>=21.2,<22.0

# --- Testing ---
pytest>=8.0,<9.0
pytest-flask>=1.3,<2.0
coverage[toml]>=7.4,<8.0

# --- Lint / Format (dev optional) ---
black>=24.3,<25.0
ruff>=0.6,<0.9
mypy>=1.10,<2.0
```

### 6.1.1 Sample backend `.env`
Copy these keys (edit values appropriately) into a local `.env` file in `backend/` (do not commit secrets):

```
FLASK_ENV=development
SECRET_KEY=change_me_dev_secret
JWT_SECRET_KEY=change_me_jwt_secret
DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/thoughts_out_loud
PAGE_SIZE_DEFAULT=20
# REDIS_URL=redis://localhost:6379/0   # (optional future)
```

### 6.2 Frontend dependencies
- Runtime (already present): `react`, `react-dom`, `vite`
- Add:
  - `react-router-dom` – routing
  - `axios` – HTTP client (or stick to fetch)
  - `tailwindcss`, `postcss`, `autoprefixer` – styling utility framework
  - `flowbite-react`, `flowbite` – prebuilt components on Tailwind
- Optional (nice to have):
  - `@tanstack/react-query` – server-state caching
  - `zod` – client-side schema validation
  - `classnames` – class name composition helper

Install suggestion (from `frontend/`):

```
npm i react-router-dom axios tailwindcss postcss autoprefixer flowbite-react flowbite
```

## 7. Deployment (Future Outline)
- Backend: Gunicorn + Nginx reverse proxy (or Render/Heroku). Auto migrations on deploy.
- Frontend: Static build served via Netlify/Vercel.
- CI: GitHub Actions (lint, test, build). Secrets via repository settings.

## 8. MVP vs Stretch
MVP: signup/login, create/edit/delete post, feed, like, follow/unfollow, hashtags extraction/display, search users.
Stretch: admin dashboard, trending hashtags algorithm, refresh tokens, rate limiting, hashtag analytics, websocket for live feed updates.

## 9. Quality Gates & Definition of Done
A feature PR must include:
- Code + tests (≥1 unit + endpoint integration for backend; component and hook test for critical frontend pieces)
- Updated docs (README or API section)
- No lint errors (`eslint`, `flake8` or `ruff` if added)
- All tests green in CI.

## 10. API Versioning Strategy
Start with unversioned paths (`/posts`). Introduce `/v1/` prefix when first breaking change required. Maintain previous version for deprecation period.

## 11. Observability (Future)
Add request logging (structured JSON), error tracking (Sentry), and basic metrics (Prometheus or StatsD) in stretch phase.

## 12. Contribution Workflow
1. Open issue describing feature.
2. Create branch `feature/<name>`.
3. Implement + tests.
4. Run linters & tests locally.
5. Open PR, request review from peers.
6. Address feedback, squash & merge.

## 13. Security & Privacy Notes
- Never log full JWT or password hashes.
- Enforce strong password rules (min length, complexity) client + server.
- Use parameterized queries via ORM only.
- Prepare for GDPR-like deletion: cascade delete user content (stretch with soft delete maybe).

## 14. Data Retention & Cleanup (Future)
Potential monthly job to remove orphaned data if any and recompute hashtag popularity.

## 15. FAQ (Anticipated Question)
Q: Why Flask instead of FastAPI?  
A: Flask’s simplicity and ecosystem familiarity for the team make onboarding faster; with blueprints + extensions we meet all current requirements. If async at scale or automatic OpenAPI generation becomes critical, migration path to FastAPI is straightforward.

---
This guideline evolves; update sections as architecture decisions are finalized.
