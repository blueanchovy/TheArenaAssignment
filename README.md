# Project README

Simple social feed using wallet-based authentication.

## Quick start

Prerequisites: Node.js, npm, PostgreSQL (or hosted provider like Neon).

1) Frontend
```
cd client
npm install
npm run dev
# open http://localhost:3000
```

2) Backend
```
cd server
npm install
# create .env with DATABASE_URL (from pgadmin, Neon, etc.)
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
# open http://localhost:8000
```

## Environment variables

At minimum, in `server/.env`:
- DATABASE_URL=postgresql://user:pass@host:port/dbname
- (optional) PORT=8000

## Authentication / Wallet integration

- RainbowKit for wallet UI (frontend)
- ethers.js to get addresses and sign messages
- Wallet address is the unique login identifier
- Session stored in the browser (client-side session)

## Backend API (NestJS) — Summary

Authentication
- POST /auth/verify  
  Accepts a signed message and validates the associated wallet address.

User profile
- GET /users/:wallet — Get a user's profile  
- POST /users — Create or update a profile

Posts
- GET /posts — Returns the latest feed  
- GET /posts/:id — Get a post with comments and likes  
- POST /posts — Create a new post  
- POST /posts/:id/like — Like a post  
- POST /posts/:id/comment — Add a comment

(Endpoints return JSON; standard HTTP status codes apply.)

## Database schema (PostgreSQL)

- users
  - wallet_address (PRIMARY KEY)
  - username
  - bio
  - profile_pic_url

- posts
  - id SERIAL PRIMARY KEY
  - wallet_address (author)
  - content
  - timestamp

- likes
  - post_id
  - wallet_address
  - PRIMARY KEY (post_id, wallet_address)

- comments
  - id SERIAL PRIMARY KEY
  - post_id
  - wallet_address
  - content
  - timestamp

## Frontend — Pages

- /           — Public feed of posts
- /profile    — Logged-in user profile (view & edit)
- /post/[id]  — Post details with comments

## Frontend — Key components

- Wallet Connect Button
- Post Composer (create post)
- Feed / Post List
- Post Card (like & comment actions)
- Profile Card and Edit Form

## Notes & tips

- Ensure frontend and backend ports do not conflict.
- Use a persistent Postgres instance (local or hosted) for testing data persistence.
- For Prisma: regenerate client after schema changes (`npx prisma generate`), then migrate.
