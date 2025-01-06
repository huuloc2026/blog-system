
# Newspaper system with users interact

This project is a news portal system that manages content and user interactions, providing APIs for user registration, login, account management, posting news articles, commenting, and tracking user interactions with news content. The system implements secure authentication mechanisms, password hashing, token-based authentication with JWT, and utilizes caching for performance optimization. The system supports flexible role-based access control (Admin, Moderator, User) for managing content and interactions.

## Key Features

### 1. User Authentication:
- **Registration:** Users can register by providing an email and password. The email is validated via regex, and the password is hashed using bcrypt. After registration, users receive an email verification code to activate their account.
- **Login:** Users log in using email and password, receiving **access tokens** and **refresh tokens** for secure API access.
- **Password Change:** Users can update their password, which invalidates the current tokens and generates new ones.
- **Logout:** Access and refresh tokens are invalidated upon logout.

### 2. User Management:
- Users can update optional personal information such as name, date of birth, gender, phone number, address, and profile picture.
- **Refresh Token:** API to issue a new access token and refresh token using the refresh token.

### 3. News Management:
- **Post News Articles:** Admins and Moderators can create news articles with properties like title, content, thumbnail, category, tags, status, and description.
- **Update News Articles:** Moderators can edit existing articles, which are updated in the cache.
- **View News Article Details:** Provides detailed information about articles, including views and comments. Cache is used to improve performance, with database fallback when necessary.
- **List Articles by Category:** Pagination support for fetching articles by category, with filters for page number and limit.

### 4. Commenting System:
- Users can post, update, and delete their comments. Each article allows only one comment per user.
- **Comment Replies:** Support for replies to comments, limited to one level (parent-child relationship).
- **Comment Management:** Admins and Moderators can hide comments deemed inappropriate.

## Technologies Used:
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (or SQL, based on requirements)
- **Authentication:** JWT (JSON Web Tokens), Bcrypt (for password hashing)
- **Caching:** Redis (for caching articles, user interactions, and comments)
- **Email Service:** Nodemailer (for email verification)
- **Validation:** Regex (for email and password format validation)
- **Middleware:** Authentication and role-based access control middleware (Admin, Moderator, User)

## Role & Responsibilities:
- Developed and implemented authentication and user account management APIs.
- Designed and built APIs for news article creation, updates, and comment management.
- Integrated role-based access control for Admin, Moderator, and User roles.
- Implemented caching mechanisms using Redis to improve performance.
- Ensured security of APIs through JWT and password hashing.

## Achievements:
- Efficient user account management and content handling.
- Improved performance by utilizing Redis caching.
- Ensured robust security with JWT and encrypted passwords.

## Authors

- [@huuloc2026](https://www.github.com/huuloc2026)


## Deployment

To deploy this project run

```bash
  yarn run dev
```


## Screenshots

![App Screenshot](https://miro.medium.com/v2/resize:fit:1200/1*XcCVsOQugD-vG7g2Ohrvyw.png)




