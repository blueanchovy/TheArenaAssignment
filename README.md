#frontend
> cd client \n
> npm i
> npm run dev
> check localhost:3000



#backend
> cd server
> npm i
> create .env file and add DATABASE_URL either from pgadmin or a provider like neon
> then run -> npx prisma generate npx prisma migrate dev --name init
> npm run start:dev
> check localhost:8000

1. Wallet Integration
● RainbowKit for a user-friendly wallet connection UI.
● ethers.js to retrieve user addresses and sign messages as necessary.
● Wallet address is the exclusive identifier for login.
● Session information stored within the browser.

2. Backend API (NestJS)
RESTful API with the following endpoints:Authentication
● `POST /auth/verify`: Accepts a signed message and validates the
associated wallet address.
User Profile
● `GET /users/:wallet`: Retrieves a specific user's profile.
● `POST /users`: Creates or updates a user's profile.
Posts
● `GET /posts`: Returns a feed of the latest posts.
● `POST /posts`: Creates a new post.

● `POST /posts/:id/like`: Registers a "like" for a specific post.
● `POST /posts/:id/comment`: Adds a comment to a specific post.
● `GET /posts/:id`: Fetches detailed information for a specific post,
including its comments and likes.


3.Database Schema (PostgreSQL)
● `users` (`wallet_address` PRIMARY KEY, `username`, `bio`,
`profile_pic_url`)
● `posts` (`id` SERIAL PRIMARY KEY, `wallet_address`, `content`,
`timestamp`)
● `likes` (`post_id`, `wallet_address`, PRIMARY KEY (`post_id`,
`wallet_address`))
● `comments` (`id` SERIAL PRIMARY KEY, `post_id`, `wallet_address`,
`content`, `timestamp`)

4. Frontend Interface Pages:
● `/`: Displays the public feed of posts.
● `/profile`: Shows the logged-in user’s profile, with options for viewing
and editing.
● `/post/[id]`: Presents the details of a specific post, including its
comments.

Components:
● Wallet Connect Button
● Post Composer (for creating new posts)
● Feed/Post List (for displaying posts)
● Post Card (individual post display with like and comment actions)
● Profile Card and Edit Form
