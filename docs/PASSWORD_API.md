# Password Management API Documentation

## Overview
The Password Management API provides secure password operations including password updates, user management, and authentication-related functionality. This API follows security best practices with bcrypt hashing and validation.

## Base URL
```
/api/v1/password
```

## Authentication
All endpoints require authentication via Bearer token.

```
Authorization: Bearer {token}
```

## Endpoints

### 1. Get All Users
**GET** `/api/v1/password`

Retrieves a paginated list of all users for password management purposes.

**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `search` (optional): Search term for user filtering
- `sort` (optional): Sort order (asc/desc)

**Example Request:**
```bash
GET /api/v1/password?page=1&limit=10&sort=asc
Authorization: Bearer {token}
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_date": "2025-07-11T10:30:00Z",
      "updated_date": "2025-07-11T10:30:00Z",
      "last_login": "2025-07-11T09:15:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### 2. Get User Details
**GET** `/api/v1/password/:id`

Retrieves detailed information about a specific user for password management.

**Authentication:** Required

**Path Parameters:**
- `id` (required): The user's unique identifier

**Example Request:**
```bash
GET /api/v1/password/1
Authorization: Bearer {token}
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "password": "$2b$10$hashedPasswordString..."
    }
  ]
}
```

### 3. Update Password
**PUT** `/api/v1/password`

Updates a user's password with proper validation and security checks.

**Authentication:** Required

**Request Body:**
- `id` (required): User ID
- `oldPassword` (required): Current password
- `newPassword` (required): New password

**Example Request:**
```bash
PUT /api/v1/password
Content-Type: application/json
Authorization: Bearer {token}

{
  "id": 1,
  "oldPassword": "currentPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Update Success."
}
```

## Password Security Requirements

### Password Policies
- **Minimum length:** 8 characters
- **Recommended length:** 12+ characters
- **Character requirements:** Mix of uppercase, lowercase, numbers, and symbols
- **Forbidden patterns:** Common passwords, sequential characters, repeated characters

### Security Features
- **Bcrypt hashing:** Industry-standard password hashing
- **Salt generation:** Unique salt for each password
- **Password verification:** Secure comparison using bcrypt
- **Old password verification:** Required for password updates

### Password Hashing Details
```javascript
// Salt rounds: 10 (2^10 = 1024 iterations)
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid user ID or missing required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Old Password is not match."
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
  "message": "Failed to update password"
}
```

## Security Best Practices

### Password Storage
- Never store plain text passwords
- Use bcrypt with appropriate salt rounds
- Implement password hashing on server-side only
- Store hashed passwords in secure database

### Password Validation
- Validate old password before allowing updates
- Implement rate limiting for password attempts
- Log password change attempts for security auditing
- Use secure password comparison functions

### API Security
- Require authentication for all endpoints
- Implement proper session management
- Use HTTPS for all password-related operations
- Validate and sanitize all input data

## Rate Limiting

Password-related operations are subject to rate limiting:
- **Password updates:** 5 attempts per hour per user
- **User listing:** 100 requests per hour
- **User details:** 50 requests per hour

## Audit Logging

The API logs important security events:
- Password change attempts (successful and failed)
- Authentication failures
- Unauthorized access attempts
- User account modifications

## Database Schema

### Users Table Structure
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    password_changed_at TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    account_locked_until TIMESTAMP NULL
);
```

### Password History (Optional)
```sql
CREATE TABLE password_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    password_hash VARCHAR(255) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Integration Examples

### Frontend Integration
```javascript
// Password update example
const updatePassword = async (userId, oldPassword, newPassword) => {
    try {
        const response = await fetch('/api/v1/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id: userId,
                oldPassword,
                newPassword
            })
        });
        
        const result = await response.json();
        if (result.success) {
            console.log('Password updated successfully');
        }
    } catch (error) {
        console.error('Password update failed:', error);
    }
};
```

### Security Headers
```javascript
// Recommended security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    next();
});
```

## Compliance and Standards

### Security Standards
- **OWASP Guidelines:** Following OWASP password security guidelines
- **GDPR Compliance:** Proper handling of user data
- **SOC 2 Type II:** Security controls implementation
- **ISO 27001:** Information security management

### Password Strength Validation
```javascript
// Client-side password strength validation
const validatePasswordStrength = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
        isValid: password.length >= minLength && hasUpperCase && 
                hasLowerCase && hasNumbers && hasSymbols,
        strength: calculateStrength(password)
    };
};
```

## Testing

### Password Security Tests
- Password hashing verification
- Old password validation
- Rate limiting functionality
- Input sanitization
- Authentication token validation

### Unit Test Examples
```javascript
// Example test for password update
describe('Password Update', () => {
    it('should update password with valid credentials', async () => {
        const result = await updatePassword({
            id: 1,
            oldPassword: 'oldPassword123',
            newPassword: 'newPassword456'
        });
        expect(result.success).toBe(true);
    });
    
    it('should reject update with invalid old password', async () => {
        const result = await updatePassword({
            id: 1,
            oldPassword: 'wrongPassword',
            newPassword: 'newPassword456'
        });
        expect(result.success).toBe(false);
    });
});
```
