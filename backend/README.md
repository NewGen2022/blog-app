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
- `git clone https://github.com/NewGen2022/blog-app.git`
- `cd blog-app/backend`
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


## Schema explained

User Model
- A User can have many posts. This means a user can create multiple posts, but a post can only have one author (a single user).
- A User can have many comments. This means a user can leave multiple comments on posts.
- The User has a role that can define their access level, such as:
  - READER (can only read posts),
  - COMMENTATOR (can comment on posts),
  - ADMIN (COMMENTATOR + CRUD posts + can delete posts of other people (it's me ;)).

Post Model
- A Post is created by the admin. A post must have one author (a single user).
- A Post can have many comments. Multiple users can comment on the same post.
- A Post can have many tags. Tags help categorize posts. These are many-to-many relationships, meaning a post can be linked to multiple tags and each tag can apply to multiple posts.

Comment Model
- A Comment is written by a User and tied to a specific Post. A comment can only belong to one post, but a post can have many comments.
- Comments have a userId linking them to a user (the commenter) and a postId linking them to the post being commented on.
    
Tag Model
- A Tag can be applied to many posts, and a Post can have many tags. The relationship is many-to-many, allowing for flexible tagging and categorization of posts.
    
PostTag Model
- The PostTag model is the intermediary that links posts to tags. A post can have many tags, and tags can be linked to multiple posts. This is a many-to-many relationship, where PostTag stores pairs of postId and tagId.
    
Key Relationships:
- User ↔ Post: Admin can have many posts, but a Post has one author (a single User).
- User ↔ Comment: A User can leave many comments, but a Comment belongs to one User.
- Post ↔ Comment: A Post can have many comments, and each Comment is linked to one Post.
- Post ↔ Tag: A Post can have many tags, and each Tag can be linked to many posts via the PostTag relationship.
    
Practical Example:
- User: You, as an admin, can create many posts and leave many comments.
- Post: Each post you create can have many comments from different users, and each post can be associated with multiple tags.
- Comment: Each comment can be associated with one user and one post.
- Tag: You can use tags to categorize your posts. For example, a post about "Tech News" might be tagged with Technology, and other posts about technology will share the same tag.
  
In simpler terms, the relationships work like this:
- You (admin) can write many Posts.
- Each Post can have many Comments.
- Posts can be tagged with Tags.
- A User can leave many Comments on many Posts.
- And the PostTag model is there to connect posts to tags in a many-to-many relationship.


