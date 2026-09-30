# Lumora Blog API

Lumora is a multi-author blogging platform built with Express, TypeScript, Prisma, and PostgreSQL.

This document describes the API currently implemented in the backend and recommends the features and engineering improvements that will make Lumora production-ready.

## 1. Getting started

### Base URLs

```text
Local API:  http://localhost:5000/api/v1
Health:     http://localhost:5000/health
```

The server port can be changed with the `PORT` environment variable.

### Authentication

After login, store the returned `accessToken` and send it on protected requests:

```http
Authorization: <access-token>
```

> Current implementation expects the raw JWT value. For a production API, standardize this to `Authorization: Bearer <access-token>` and validate the prefix in the auth middleware.

### Standard response

Successful responses use this shape:

```json
{
  "success": true,
  "message": "Blogs fetched successfully!",
  "meta": null,
  "data": {}
}
```

Errors use this shape:

```json
{
  "success": false,
  "message": "A useful error message"
}
```

## 2. Authentication endpoints

### Register

```http
POST /auth/register
Content-Type: application/json
```

Request:

```json
{
  "name": "Ava Rahman",
  "email": "ava@example.com",
  "password": "StrongPassword123!"
}
```

Returns `201 Created`. The password is hashed and a profile is created automatically. The password is never returned.

### Login

```http
POST /auth/login
Content-Type: application/json
```

Request:

```json
{
  "email": "ava@example.com",
  "password": "StrongPassword123!"
}
```

Returns `200 OK`:

```json
{
  "success": true,
  "message": "Logged in successfully!",
  "data": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

The refresh token is also written to an HTTP cookie named `refreshToken`.

## 3. User and profile endpoints

| Method | Endpoint | Auth | Description |
|---|---|---:|---|
| `GET` | `/user/me` | Yes | Get the current user, profile, followers, and following list |
| `PATCH` | `/user/profile` | Yes | Update the current profile |
| `GET` | `/user/authors` | No | List users with at least one published blog |
| `GET` | `/user/allUser` | Admin | List all users |
| `DELETE` | `/user/:id` | Admin | Delete a user |
| `POST` | `/user/:id/follow` | Yes | Follow or unfollow a user |
| `GET` | `/user/:id/follow/status` | Yes | Check whether the current user follows a user |

### Profile update body

All fields are optional:

```json
{
  "bio": "Writer and product designer.",
  "avatar": "https://cdn.example.com/avatar.jpg",
  "coverImage": "https://cdn.example.com/cover.jpg",
  "username": "ava-rahman",
  "location": "Dhaka, Bangladesh",
  "website": "https://ava.example.com",
  "facebook": "https://facebook.com/ava",
  "instagram": "https://instagram.com/ava",
  "twitter": "https://x.com/ava",
  "linkedin": "https://linkedin.com/in/ava",
  "github": "https://github.com/ava",
  "profession": "Product designer",
  "expertise": "Design systems, UX research"
}
```

## 4. Blog endpoints

| Method | Endpoint | Auth | Description |
|---|---|---:|---|
| `GET` | `/blog` | No | List blogs ordered by newest first; supports `?search=` |
| `GET` | `/blog/my` | Yes | List the current user's blogs |
| `GET` | `/blog/:id` | No | Get one blog by immutable database ID, increment its view count, and return comments |
| `POST` | `/blog` | Yes | Create a blog |
| `PATCH` | `/blog/:id` | Yes | Update a blog owned by the author or an admin |
| `DELETE` | `/blog/:id` | Yes | Delete a blog owned by the author or an admin |
| `GET` | `/blog/:id/like` | Yes | Get the current user's like status |
| `POST` | `/blog/:id/like` | Yes | Like or unlike a blog |
| `POST` | `/blog/:id/comments` | Yes | Add a comment or reply |

### Blog create/update body

```json
{
  "title": "How to Build a Better Writing Habit",
  "excerpt": "A practical guide for publishing consistently.",
  "content": "Your blog content goes here...",
  "coverImage": "https://cdn.example.com/writing.jpg",
  "status": "DRAFT"
}
```

Allowed statuses:

```text
DRAFT | PUBLISHED | ARCHIVED
```

The slug is generated from the title and remains the public SEO identifier. The editor and admin mutation actions use the immutable blog `id`, so title changes cannot break edit or delete requests. Only admins can change publication status in the current implementation.

### Search blogs

```http
GET /blog?search=design
```

Search checks the blog title, excerpt, content, category name, and author name. The search is case-insensitive and returns the normal blog list response.

## 5. Category endpoints

| Method | Endpoint | Auth | Description |
|---|---|---:|---|
| `GET` | `/category` | No | List categories with blog counts |
| `POST` | `/category` | Admin | Create a category |
| `PATCH` | `/category/:id` | Admin | Rename or update a category |
| `DELETE` | `/category/:id` | Admin | Delete a category; related blogs become uncategorized |

### Create or update category

```json
{
  "name": "Technology",
  "description": "Engineering, software, and emerging technology."
}
```

The API generates a unique slug from the category name. Blogs accept the selected category through `categoryId`:

```json
{
  "title": "A practical guide to APIs",
  "content": "...",
  "categoryId": "category-uuid"
}
```

### Like and comment endpoints

Authenticated like and comment operations also use the immutable blog ID:

```text
GET  /blog/:id/like
POST /blog/:id/like
POST /blog/:id/comments
```

### Create a comment

```http
POST /blog/:id/comments
Content-Type: application/json
```

```json
{
  "content": "This was a very useful perspective.",
  "parentId": "optional-parent-comment-id"
}
```

### Like response

```json
{
  "success": true,
  "message": "Blog liked",
  "data": {
    "liked": true,
    "likes": 12
  }
}
```

## 6. Roles and permissions

| Role | Permissions |
|---|---|
| `USER` | Read blogs, like, comment, follow authors, and manage own profile |
| `AUTHOR` | User permissions plus create and manage own blogs |
| `ADMIN` | Manage users, manage all blogs, and change publication status |

## 7. Data model summary

The current Prisma schema contains:

- `User` and one-to-one `Profile`
- `Blog` with draft, published, and archived states
- `Comment` with nested replies
- `Like` with one-like-per-user enforcement
- `Follow` with duplicate-follow prevention
- `Role` enum: `USER`, `AUTHOR`, `ADMIN`

## 8. Recommended professional features

### Priority 1 — do these first

1. **Input validation**: Add Zod or Joi schemas for register, login, profiles, blogs, and comments. Validate email format, password strength, title length, content length, URLs, and enum values.
2. **Public-only publishing**: Make `GET /blog` return only `PUBLISHED` blogs. Drafts should be visible only through `/blog/my` or admin endpoints.
3. **Pagination and filtering**: Add `page`, `limit`, `search`, `status`, `authorId`, `sort`, and `tag` query parameters. Return `meta` with page, limit, total, and totalPages.
4. **Correct authorization**: Allow authors to publish their own work if that is the product rule, or introduce an admin moderation workflow with `PENDING_REVIEW`.
5. **Security hardening**: Add rate limiting, helmet, secure cookies in production, password reset, refresh-token rotation, account lockout, and consistent `401`/`403` errors.
6. **Tests and API documentation**: Add integration tests for auth, ownership, publishing, comments, likes, and follows. Consider OpenAPI/Swagger for interactive API documentation.

### Priority 2 — features that improve the product

1. **Tags and categories** for discovery and SEO.
2. **Bookmarks/saved blogs** so readers can return later.
3. **Search** using PostgreSQL full-text search or a search service.
4. **Notifications** for new followers, likes, replies, and publication events.
5. **Author dashboard** with views, likes, comments, followers, and top-performing posts.
6. **Moderation tools** for reported comments, blocked words, soft deletion, and audit logs.
7. **Rich editor support** with Markdown or sanitized HTML, image uploads, drafts, autosave, and preview mode.
8. **Newsletter subscriptions** and email notifications for new posts.

### Priority 3 — premium/professional polish

1. **SEO metadata**: canonical URL, Open Graph image, Twitter card, sitemap, RSS feed, and JSON-LD article schema.
2. **Reading experience**: reading-time calculation, table of contents, related posts, share links, and dark mode.
3. **Media pipeline**: object storage, image resizing, WebP/AVIF conversion, CDN delivery, and upload validation.
4. **Analytics**: unique views, referrers, device breakdown, and daily/weekly/monthly trends.
5. **Payments or memberships** if Lumora will support paid articles, subscriptions, or author tips.

## 9. Recommended next API additions

```text
GET    /blog?search=&page=1&limit=12&tag=design&sort=popular
GET    /blog/featured
GET    /blog/trending
POST   /blog/:id/bookmark
GET    /user/me/bookmarks
DELETE /blog/:id/bookmark
POST   /uploads/image
GET    /tags
POST   /newsletter/subscribe
POST   /auth/refresh
POST   /auth/logout
POST   /auth/forgot-password
POST   /auth/reset-password
```

## 10. Important implementation notes

- Add a unique constraint to prevent a user from following themselves at the database or service layer; the service currently checks this in application code.
- Do not log request bodies or authenticated user objects in production because they may contain sensitive information.
- The CORS origin expression should be fixed so the deployed frontend URL is explicitly allowed instead of relying on a fallback expression.
- Use soft deletion for users and blogs if you need auditability or recovery.
- Preserve old slugs with a `BlogSlug` history table if SEO links must continue working after title changes.
- Never expose `password`, refresh tokens, or internal authorization details in API responses.

## 11. Suggested delivery order

```text
Phase 1: validation + pagination + published-only feed + auth hardening
Phase 2: tags + search + bookmarks + notifications + moderation
Phase 3: SEO + media storage + analytics + newsletter
Phase 4: memberships, paid content, and advanced author tools
```

