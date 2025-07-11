# Ebooks API Documentation

## Overview
The Ebooks API provides comprehensive CRUD operations for managing electronic books in the system. This API follows RESTful principles and includes features like caching, validation, file upload support, and content categorization.

## Base URL
```
/api/v1/ebooks
```

## Endpoints

### 1. Get All Ebooks
**GET** `/api/v1/ebooks`

Retrieves a paginated list of all ebooks with optional filtering and searching.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `search` (optional): Search term for title, description, subtitle, or author
- `sort` (optional): Sort order (asc/desc)
- `category` (optional): Filter by category (default: "all")

**Example Request:**
```bash
GET /api/v1/ebooks?page=1&limit=10&search=javascript&category=programming
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "JavaScript: The Good Parts",
      "subtitle": "A comprehensive guide to JavaScript best practices",
      "author": "Douglas Crockford",
      "publisher": "O'Reilly Media",
      "isbn": "978-0596517748",
      "description": "A deep dive into the good parts of JavaScript...",
      "category": "programming",
      "language": "English",
      "page_count": 176,
      "file_size_mb": 2.5,
      "file_format": "pdf",
      "file_path": "/uploads/ebooks/javascript-good-parts.pdf",
      "cover_image_url": "javascript-cover.jpg",
      "price": 29.99,
      "publication_date": "2008-05-01",
      "rating": 4.5,
      "created_date": "2025-07-11T10:30:00Z",
      "updated_date": "2025-07-11T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### 2. Get Ebook by ID
**GET** `/api/v1/ebooks/:id`

Retrieves detailed information about a specific ebook.

**Path Parameters:**
- `id` (required): The ebook's unique identifier

**Example Request:**
```bash
GET /api/v1/ebooks/1
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "JavaScript: The Good Parts",
    "subtitle": "A comprehensive guide to JavaScript best practices",
    "author": "Douglas Crockford",
    "publisher": "O'Reilly Media",
    "isbn": "978-0596517748",
    "description": "A deep dive into the good parts of JavaScript...",
    "category": "programming",
    "language": "English",
    "page_count": 176,
    "file_size_mb": 2.5,
    "file_format": "pdf",
    "file_path": "/uploads/ebooks/javascript-good-parts.pdf",
    "cover_image_url": "javascript-cover.jpg",
    "price": 29.99,
    "publication_date": "2008-05-01",
    "rating": 4.5,
    "created_date": "2025-07-11T10:30:00Z",
    "updated_date": "2025-07-11T10:30:00Z"
  }
}
```

### 3. Get Related Ebooks
**GET** `/api/v1/ebooks/related/:id`

Retrieves a list of ebooks related to a specific ebook.

**Path Parameters:**
- `id` (required): The ebook's unique identifier

**Query Parameters:**
- `limit` (optional): Number of related ebooks to return (default: 5)

**Example Request:**
```bash
GET /api/v1/ebooks/related/1?limit=5
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "title": "You Don't Know JS",
      "author": "Kyle Simpson",
      "category": "programming",
      "rating": 4.7,
      "cover_image_url": "js-series-cover.jpg"
    }
  ],
  "total": 1
}
```

### 4. Create New Ebook
**POST** `/api/v1/ebooks`

Creates a new ebook record with file upload.

**Content-Type:** `multipart/form-data`

**Request Body:**
- `title` (required): Ebook title
- `subtitle` (optional): Ebook subtitle
- `author` (required): Author name
- `publisher` (optional): Publisher name
- `isbn` (optional): ISBN number
- `description` (optional): Book description
- `category` (required): Book category
- `language` (optional): Book language
- `page_count` (optional): Number of pages
- `price` (optional): Book price
- `publication_date` (optional): Publication date (YYYY-MM-DD format)
- `rating` (optional): Book rating (0-5)
- `file` (required): PDF file upload

**Example Request:**
```bash
POST /api/v1/ebooks
Content-Type: multipart/form-data

{
  "title": "Advanced JavaScript Patterns",
  "author": "John Doe",
  "category": "programming",
  "language": "English",
  "price": 39.99,
  "file": [PDF file]
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Ebook created successfully",
  "data": {
    "id": 2,
    "title": "Advanced JavaScript Patterns",
    "created_date": "2025-07-11T10:30:00Z"
  }
}
```

### 5. Update Ebook
**PATCH** `/api/v1/ebooks/:id`

Updates an existing ebook record.

**Path Parameters:**
- `id` (required): The ebook's unique identifier

**Content-Type:** `multipart/form-data`

**Request Body:** (All fields optional)
- `title`: Ebook title
- `subtitle`: Ebook subtitle
- `author`: Author name
- `publisher`: Publisher name
- `isbn`: ISBN number
- `description`: Book description
- `category`: Book category
- `language`: Book language
- `page_count`: Number of pages
- `price`: Book price
- `publication_date`: Publication date
- `rating`: Book rating
- `file`: New PDF file (optional)

**Example Request:**
```bash
PATCH /api/v1/ebooks/1
Content-Type: multipart/form-data

{
  "title": "JavaScript: The Good Parts (Updated)",
  "price": 34.99
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Ebook updated successfully",
  "data": {
    "id": 1,
    "title": "JavaScript: The Good Parts (Updated)",
    "updated_date": "2025-07-11T10:30:00Z"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "No file uploaded."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Ebook not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to process ebook"
}
```

## File Upload Requirements

- **Supported formats:** PDF
- **Maximum file size:** 50MB
- **Required:** Yes for creating new ebooks
- **Optional:** For updating existing ebooks

## Caching

The API implements caching for improved performance:
- **List queries:** Cached for 15 minutes
- **Detail queries:** Cached for 15 minutes
- **Cache key format:** `ebooks_list_{parameters}` or `ebook_detail_{id}`

## Search Functionality

The search parameter supports searching across:
- Title
- Description
- Subtitle
- Author name

Search is case-insensitive and supports partial matches.

## Categories

Common ebook categories include:
- programming
- fiction
- non-fiction
- science
- history
- biography
- fantasy
- mystery
- romance
- self-help
