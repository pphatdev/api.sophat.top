# Authors API Documentation

## Overview
The Authors API provides comprehensive CRUD operations for managing book authors in the system. This API follows RESTful principles and includes features like caching, validation, and image upload support.

## Base URL
```
/api/v1/authors
```

## Endpoints

### 1. Get All Authors
**GET** `/api/v1/authors`

Retrieves a paginated list of all authors with optional filtering and searching.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `search` (optional): Search term for author name, biography, or nationality
- `sort` (optional): Sort order (asc/desc)
- `nationality` (optional): Filter by nationality

**Example Request:**
```bash
GET /api/v1/authors?page=1&limit=10&search=rowling&nationality=British
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "J.K. Rowling",
      "biography": "British author best known for the Harry Potter series...",
      "birth_date": "1965-07-31",
      "death_date": null,
      "nationality": "British",
      "website": "https://www.jkrowling.com",
      "awards": "Order of the British Empire, Hugo Award, British Book Awards",
      "genres": "Fantasy, Young Adult, Crime Fiction",
      "profile_image_url": "jk_rowling.jpg",
      "age": 59,
      "is_alive": true,
      "books_count": 15,
      "created_date": "2025-07-11T10:30:00Z",
      "updated_date": "2025-07-11T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### 2. Get Author by ID
**GET** `/api/v1/authors/:id`

Retrieves detailed information about a specific author.

**Path Parameters:**
- `id` (required): The author's unique identifier

**Example Request:**
```bash
GET /api/v1/authors/1
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "J.K. Rowling",
    "biography": "British author best known for the Harry Potter series...",
    "birth_date": "1965-07-31",
    "death_date": null,
    "nationality": "British",
    "website": "https://www.jkrowling.com",
    "awards": "Order of the British Empire, Hugo Award, British Book Awards",
    "genres": "Fantasy, Young Adult, Crime Fiction",
    "profile_image_url": "jk_rowling.jpg",
    "created_date": "2025-07-11T10:30:00Z",
    "updated_date": "2025-07-11T10:30:00Z"
  }
}
```

### 3. Create New Author
**POST** `/api/v1/authors`

Creates a new author record.

**Request Body:**
- `name` (required): Author's full name
- `biography` (optional): Author's biography
- `birth_date` (optional): Date of birth (YYYY-MM-DD format)
- `death_date` (optional): Date of death (YYYY-MM-DD format)
- `nationality` (optional): Author's nationality
- `website` (optional): Author's official website
- `awards` (optional): Awards and recognitions received
- `genres` (optional): Genres the author writes in
- `profile_image` (optional): Author's profile image (multipart/form-data)

**Example Request:**
```bash
POST /api/v1/authors
Content-Type: multipart/form-data

name=George R.R. Martin
biography=American novelist and short story writer
birth_date=1948-09-20
nationality=American
website=https://www.georgerrmartin.com
awards=Hugo Award, Nebula Award, World Fantasy Award
genres=Fantasy, Science Fiction, Horror
profile_image=@george_martin.jpg
```

**Example Response:**
```json
{
  "success": true,
  "message": "Insert Success."
}
```

### 4. Update Author
**PATCH** `/api/v1/authors/:id`

Updates an existing author's information.

**Path Parameters:**
- `id` (required): The author's unique identifier

**Request Body:**
Same as Create Author, but all fields are optional.

**Example Request:**
```bash
PATCH /api/v1/authors/1
Content-Type: multipart/form-data

biography=Updated biography text
website=https://newwebsite.com
awards=Additional awards received
```

**Example Response:**
```json
{
  "success": true,
  "message": "Update Success."
}
```

### 5. Delete Author
**DELETE** `/api/v1/authors/:id`

Deletes an author from the system.

**Path Parameters:**
- `id` (required): The author's unique identifier

**Example Request:**
```bash
DELETE /api/v1/authors/1
```

**Example Response:**
```json
{
  "success": true,
  "message": "Delete Success."
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Author not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Author with this name already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Features

### Caching
- The API implements file-based caching for improved performance
- Cache TTL: 15 minutes
- Cache is automatically cleared when data is modified

### Image Upload
- Supports profile image upload for authors
- Uses multer middleware for file handling
- Images are stored in the uploads directory

### Validation
- Input validation using custom validation middleware
- Ensures data integrity and consistency

### Database Views
- Uses PostgreSQL views for optimized data retrieval
- Includes calculated fields like age and book count

### Search and Filtering
- Full-text search across name, biography, and nationality
- Nationality-based filtering
- Sorting options for various fields

## Database Schema

### Authors Table
```sql
CREATE TABLE public.authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    biography TEXT,
    birth_date DATE,
    death_date DATE,
    nationality VARCHAR(100),
    website VARCHAR(255),
    awards TEXT,
    genres TEXT,
    profile_image_url VARCHAR(255),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Database Functions
- `insert_authors()`: Function for inserting new authors with validation
- `update_authors()`: Function for updating existing authors with validation

### Database Views
- `get_authors`: View with calculated fields like age and book count

## Usage Examples

### JavaScript/Node.js
```javascript
// Get all authors
const response = await fetch('/api/v1/authors?page=1&limit=10');
const authors = await response.json();

// Create new author
const formData = new FormData();
formData.append('name', 'New Author');
formData.append('biography', 'Author biography');
formData.append('nationality', 'American');
formData.append('profile_image', imageFile);

const createResponse = await fetch('/api/v1/authors', {
  method: 'POST',
  body: formData
});
```

### curl Examples
```bash
# Get all authors
curl -X GET "http://localhost:3000/api/v1/authors?page=1&limit=10"

# Get specific author
curl -X GET "http://localhost:3000/api/v1/authors/1"

# Create new author
curl -X POST "http://localhost:3000/api/v1/authors" \
  -F "name=New Author" \
  -F "biography=Author biography" \
  -F "nationality=American" \
  -F "profile_image=@author.jpg"

# Update author
curl -X PATCH "http://localhost:3000/api/v1/authors/1" \
  -F "biography=Updated biography"

# Delete author
curl -X DELETE "http://localhost:3000/api/v1/authors/1"
```

## Migration Files

To set up the authors API in your database, run the following migration files in order:

1. `migrations/sql/create_authors_11072025_120000.sql` - Creates the authors table
2. `migrations/views/views_get_authors_11072025_120000.sql` - Creates the authors view
3. `migrations/functions/insert_authors.sql` - Creates the insert function
4. `migrations/functions/update_authors.sql` - Creates the update function
5. `migrations/seeds/authors.sql` - Populates sample data (optional)

## Recent Updates

### Version 1.1 (Fixed)
- **Fixed**: Resolved PostgreSQL function error in `update_authors` function
- **Improved**: Better error handling in database functions
- **Enhanced**: Input validation and sanitization
- **Updated**: Functions now return boolean values instead of raising exceptions
- **Added**: Proper null handling and parameter validation

### Key Improvements:
- Database functions now handle errors gracefully without raising exceptions
- Better input validation for required fields
- Consistent error messages across all operations
- Improved performance with optimized queries

## Notes

- Authentication is currently commented out but can be enabled by uncommenting the middleware
- The API follows the same patterns as other APIs in the system (ebooks, projects, etc.)
- All date fields should be in YYYY-MM-DD format
- Profile images are optional and handled through the existing image upload system
- The API includes comprehensive error handling and validation
- **Fixed**: PostgreSQL function errors have been resolved with improved error handling
