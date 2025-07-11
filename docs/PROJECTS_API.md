# Projects API Documentation

## Overview
The Projects API provides comprehensive CRUD operations for managing project portfolios in the system. This API supports project creation, image uploads, caching, and project showcase functionality with filtering and search capabilities.

## Base URL
```
/api/v1/projects
```

## Endpoints

### 1. Get All Projects
**GET** `/api/v1/projects`

Retrieves a paginated list of all projects with optional filtering and searching.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `search` (optional): Search term for project name or description
- `sort` (optional): Sort order (asc/desc)
- `published` (optional): Filter by published status (true/false, default: true)
- `image` (optional): Image transformation options as URL parameters

**Example Request:**
```bash
GET /api/v1/projects?page=1&limit=10&search=react&published=true
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "E-Commerce Platform",
      "description": "A full-stack e-commerce solution built with React and Node.js",
      "image": "ecommerce-project.png?w=400&h=300&fit=cover",
      "published": true,
      "tags": "react,nodejs,mongodb,stripe",
      "source": {
        "github": "https://github.com/user/ecommerce-platform",
        "live": "https://ecommerce-demo.com"
      },
      "authors": [
        {
          "name": "John Doe",
          "role": "Full Stack Developer",
          "email": "john@example.com"
        }
      ],
      "languages": "JavaScript,TypeScript,CSS,HTML"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### 2. Get Project by ID
**GET** `/api/v1/projects/:id`

Retrieves detailed information about a specific project.

**Path Parameters:**
- `id` (required): The project's unique identifier

**Example Request:**
```bash
GET /api/v1/projects/1
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "E-Commerce Platform",
    "description": "A comprehensive e-commerce solution featuring user authentication, product management, shopping cart, payment integration, and admin dashboard. Built with modern web technologies for optimal performance and user experience.",
    "image": "ecommerce-project.png",
    "published": true,
    "tags": "react,nodejs,mongodb,stripe,authentication",
    "source": {
      "github": "https://github.com/user/ecommerce-platform",
      "live": "https://ecommerce-demo.com",
      "documentation": "https://docs.ecommerce-demo.com"
    },
    "authors": [
      {
        "name": "John Doe",
        "role": "Full Stack Developer",
        "email": "john@example.com",
        "github": "https://github.com/johndoe"
      }
    ],
    "languages": "JavaScript,TypeScript,CSS,HTML,SQL",
    "created_date": "2025-07-11T10:30:00Z",
    "updated_date": "2025-07-11T10:30:00Z"
  }
}
```

### 3. Create New Project
**POST** `/api/v1/projects`

Creates a new project with image upload support.

**Authentication:** Required

**Content-Type:** `multipart/form-data`

**Request Body:**
- `title` (required): Project name
- `description` (required): Project description
- `published` (optional): Published status (true/false, default: true)
- `tags` (optional): Comma-separated tags
- `source` (optional): JSON object with source links
- `authors` (optional): JSON array of author objects
- `languages` (optional): Comma-separated programming languages
- `file` (required): Project image file

**Example Request:**
```bash
POST /api/v1/projects
Content-Type: multipart/form-data
Authorization: Bearer {token}

{
  "title": "Task Management App",
  "description": "A collaborative task management application with real-time updates",
  "published": true,
  "tags": "react,websocket,nodejs,postgresql",
  "source": {
    "github": "https://github.com/user/task-app",
    "live": "https://task-app-demo.com"
  },
  "authors": [
    {
      "name": "Jane Smith",
      "role": "Frontend Developer",
      "email": "jane@example.com"
    }
  ],
  "languages": "JavaScript,CSS,HTML,SQL",
  "file": [Image file]
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": 2,
    "name": "Task Management App",
    "image": "task-app-12345.png",
    "created_date": "2025-07-11T10:30:00Z"
  }
}
```

### 4. Update Project
**PUT** `/api/v1/projects`

Updates an existing project.

**Authentication:** Required

**Request Body:**
- `id` (required): Project ID
- `title` (optional): Project name
- `description` (optional): Project description
- `published` (optional): Published status
- `tags` (optional): Project tags
- `source` (optional): Source links
- `authors` (optional): Author information
- `languages` (optional): Programming languages

**Example Request:**
```bash
PUT /api/v1/projects
Content-Type: application/json
Authorization: Bearer {token}

{
  "id": 1,
  "title": "Advanced E-Commerce Platform",
  "description": "Updated description with new features",
  "tags": "react,nodejs,mongodb,stripe,ai,recommendations"
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Cooking! Coming soon...",
  "data": {
    "id": 1,
    "title": "Advanced E-Commerce Platform"
  }
}
```

### 5. Clear All Cache
**DELETE** `/api/v1/projects/cache/clear-all`

Clears all cached project data.

**Authentication:** Required

**Example Request:**
```bash
DELETE /api/v1/projects/cache/clear-all
Authorization: Bearer {token}
```

**Example Response:**
```json
{
  "success": true,
  "message": "All projects cache cleared successfully"
}
```

### 6. Get Cache Statistics
**GET** `/api/v1/projects/cache/stats`

Retrieves cache statistics and information.

**Authentication:** Required

**Example Request:**
```bash
GET /api/v1/projects/cache/stats
Authorization: Bearer {token}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "total_cached_items": 25,
    "cache_size_mb": 12.5,
    "cache_hit_rate": 0.87,
    "last_cleared": "2025-07-11T09:00:00Z",
    "cache_ttl_minutes": 15
  }
}
```

## Image Processing

The API supports advanced image processing options:

### Query Parameters for Images
- `w`: Width in pixels
- `h`: Height in pixels  
- `fit`: Resize mode (cover, contain, fill, inside, outside)
- `format`: Output format (webp, jpg, png)
- `quality`: Image quality (1-100)

**Example:**
```
/images/projects/project-image.png?w=400&h=300&fit=cover&format=webp&quality=85
```

## Project Data Structure

### Source Object
```json
{
  "github": "https://github.com/user/repo",
  "live": "https://project-demo.com",
  "documentation": "https://docs.project.com",
  "api": "https://api.project.com"
}
```

### Authors Array
```json
[
  {
    "name": "John Doe",
    "role": "Full Stack Developer",
    "email": "john@example.com",
    "github": "https://github.com/johndoe",
    "linkedin": "https://linkedin.com/in/johndoe"
  }
]
```

## Caching Strategy

The API implements comprehensive caching:
- **List queries:** Cached for 15 minutes
- **Detail queries:** Cached for 15 minutes
- **Cache key format:** `projects_list_{parameters}` or `project_detail_{id}`
- **Automatic cache invalidation:** On data updates

## Search Functionality

The search parameter supports searching across:
- Project name
- Project description
- Tags (partial matching)
- Author names
- Programming languages

## File Upload Requirements

### Image Upload
- **Supported formats:** JPG, PNG, WebP, GIF
- **Maximum file size:** 10MB
- **Recommended dimensions:** 1200x800px
- **Automatic processing:** Thumbnail generation and optimization

### File Validation
- MIME type validation
- File size limits
- Image dimension validation
- Malicious file detection

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "No file uploaded."
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Project not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to process project"
}
```

## Common Project Tags

- **Frontend:** react, vue, angular, html, css, javascript
- **Backend:** nodejs, python, java, php, ruby, golang
- **Database:** mysql, postgresql, mongodb, redis
- **Mobile:** react-native, flutter, ionic, swift, kotlin
- **Cloud:** aws, azure, gcp, docker, kubernetes
- **Tools:** git, webpack, vite, typescript, sass

## Best Practices

1. **Image Optimization:** Use appropriate image formats and sizes
2. **Descriptive Tags:** Use relevant, searchable tags
3. **Complete Information:** Provide comprehensive project descriptions
4. **Source Links:** Include working links to live demos and repositories
5. **Regular Updates:** Keep project information current
6. **Cache Management:** Monitor cache performance and clear when needed
