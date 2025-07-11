# Recommendations API Documentation

## Overview
The Recommendations API provides intelligent book recommendation services using various algorithms. This API supports personalized recommendations, similar books discovery, trending books, and popular books based on user preferences and behavior.

## Base URL
```
/api/v1/recommendations
```

## Endpoints

### 1. Get General Recommendations
**GET** `/api/v1/recommendations`

Retrieves book recommendations based on different recommendation types.

**Query Parameters:**
- `type` (optional): Recommendation type - 'popular', 'trending', 'similar', 'personalized' (default: 'popular')
- `limit` (optional): Number of recommendations to return (default: 10)
- `category` (optional): Filter by specific category
- `user_id` (optional): User ID for personalized recommendations

**Example Request:**
```bash
GET /api/v1/recommendations?type=popular&limit=5&category=programming
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "JavaScript: The Good Parts",
      "author": "Douglas Crockford",
      "category": "programming",
      "rating": 4.5,
      "recommendation_score": 0.95,
      "recommendation_type": "popular",
      "reason": "Highly rated by users in programming category",
      "cover_image_url": "javascript-cover.jpg",
      "price": 29.99,
      "publication_date": "2008-05-01"
    }
  ],
  "total": 1
}
```

### 2. Get Popular Recommendations
**GET** `/api/v1/recommendations/popular`

Retrieves the most popular books based on user ratings and interactions.

**Query Parameters:**
- `limit` (optional): Number of recommendations to return (default: 10)
- `category` (optional): Filter by specific category

**Example Request:**
```bash
GET /api/v1/recommendations/popular?limit=10&category=fiction
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "category": "fiction",
      "rating": 4.8,
      "recommendation_score": 0.92,
      "recommendation_type": "popular",
      "reason": "Classic literature with consistently high ratings",
      "cover_image_url": "gatsby-cover.jpg"
    }
  ],
  "total": 1
}
```

### 3. Get Trending Recommendations
**GET** `/api/v1/recommendations/trending`

Retrieves currently trending books based on recent user activity.

**Query Parameters:**
- `limit` (optional): Number of recommendations to return (default: 10)
- `category` (optional): Filter by specific category

**Example Request:**
```bash
GET /api/v1/recommendations/trending?limit=5
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "title": "AI and Machine Learning Fundamentals",
      "author": "Sarah Johnson",
      "category": "technology",
      "rating": 4.6,
      "recommendation_score": 0.88,
      "recommendation_type": "trending",
      "reason": "Rapidly gaining popularity in recent weeks",
      "cover_image_url": "ai-ml-cover.jpg",
      "trend_score": 0.95
    }
  ],
  "total": 1
}
```

### 4. Get User-Specific Recommendations
**GET** `/api/v1/recommendations/user/:user_id`

Retrieves personalized recommendations for a specific user based on their reading history and preferences.

**Path Parameters:**
- `user_id` (required): The user's unique identifier

**Query Parameters:**
- `limit` (optional): Number of recommendations to return (default: 10)
- `category` (optional): Filter by specific category

**Example Request:**
```bash
GET /api/v1/recommendations/user/123?limit=5&category=science
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 15,
      "title": "Quantum Physics for Beginners",
      "author": "Dr. Michael Chen",
      "category": "science",
      "rating": 4.4,
      "recommendation_score": 0.87,
      "recommendation_type": "personalized",
      "reason": "Based on your interest in physics and science books",
      "cover_image_url": "quantum-physics-cover.jpg",
      "user_compatibility": 0.91
    }
  ],
  "total": 1
}
```

### 5. Get Similar Books
**GET** `/api/v1/recommendations/book/:book_id/similar`

Retrieves books similar to a specific book based on content, genre, and user behavior.

**Path Parameters:**
- `book_id` (required): The book's unique identifier

**Query Parameters:**
- `limit` (optional): Number of similar books to return (default: 10)

**Example Request:**
```bash
GET /api/v1/recommendations/book/1/similar?limit=5
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
      "recommendation_score": 0.89,
      "recommendation_type": "similar",
      "reason": "Similar programming concepts and JavaScript focus",
      "cover_image_url": "js-series-cover.jpg",
      "similarity_score": 0.94
    }
  ],
  "total": 1
}
```

### 6. Add New Recommendation
**POST** `/api/v1/recommendations`

Creates a new recommendation entry in the system.

**Request Body:**
- `user_id` (optional): User ID for personalized recommendations
- `book_id` (required): Book ID to recommend
- `recommendation_type` (optional): Type of recommendation (default: 'similar')
- `recommendation_score` (optional): Score between 0 and 1 (default: 0.5)
- `reason` (optional): Reason for the recommendation

**Example Request:**
```bash
POST /api/v1/recommendations
Content-Type: application/json

{
  "user_id": "123",
  "book_id": "5",
  "recommendation_type": "personalized",
  "recommendation_score": 0.85,
  "reason": "User shows interest in fantasy literature"
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Recommendation added successfully",
  "data": {
    "id": 101,
    "user_id": "123",
    "book_id": "5",
    "recommendation_type": "personalized",
    "recommendation_score": 0.85,
    "created_date": "2025-07-11T10:30:00Z"
  }
}
```

## Recommendation Types

### Popular
- Based on overall user ratings and interactions
- Considers global popularity metrics
- Updated regularly based on user feedback

### Trending
- Based on recent user activity and engagement
- Considers time-sensitive popularity spikes
- Refreshed frequently to capture current trends

### Similar
- Content-based recommendations
- Analyzes book metadata, genres, and topics
- Uses collaborative filtering algorithms

### Personalized
- User-specific recommendations
- Based on reading history and preferences
- Considers user ratings and behavior patterns

## Caching

The API implements intelligent caching:
- **General recommendations:** Cached for 30 minutes
- **User-specific recommendations:** Cached for 15 minutes
- **Similar books:** Cached for 1 hour
- **Cache key format:** `recommendations_{type}_{parameters}`

## Algorithm Details

### Recommendation Scoring
- **Popularity Score:** Based on user ratings, downloads, and views
- **Similarity Score:** Content-based similarity using NLP and metadata analysis
- **Personalization Score:** User behavior and preference matching
- **Trending Score:** Recent activity and engagement metrics

### Factors Considered
- User reading history
- Book ratings and reviews
- Genre preferences
- Author preferences
- Publication recency
- User demographic data
- Community engagement metrics

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Book ID is required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to get recommendations"
}
```

## Rate Limiting

- **General recommendations:** 100 requests per hour
- **User-specific recommendations:** 50 requests per hour
- **Similar books:** 200 requests per hour

## Performance Optimization

- Database function calls for efficient querying
- Intelligent caching strategy
- Asynchronous processing for complex algorithms
- Optimized database indexes for recommendation queries
