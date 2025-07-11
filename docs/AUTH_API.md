# Authentication API Documentation

## Overview
The Authentication API provides secure user authentication services including login, token generation, and session management. This API uses JWT tokens for stateless authentication with bcrypt for password hashing.

## Base URL
```
/api/v1/auth
```

## Endpoints

### 1. User Login
**POST** `/api/v1/auth`

Authenticates a user and returns an access token for subsequent API requests.

**Request Body:**
- `email` (required): User's email address
- `password` (required): User's password

**Example Request:**
```bash
POST /api/v1/auth
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Example Response (Success):**
```json
{
  "success": true,
  "data": {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "clientId": "987fcdeb-51a2-43d7-b890-123456789abc",
    "createdAt": "11-07-2025 10:30:00 AM",
    "tokenType": "Bearer",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenFull": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expireDate": "11-08-2025 10:30:00 AM"
  }
}
```

**Example Response (Invalid Email):**
```json
{
  "success": false,
  "message": "Wrong Email."
}
```

**Example Response (Invalid Password):**
```json
{
  "success": false,
  "message": "Wrong Password."
}
```

## Authentication Flow

### 1. Login Process
1. User provides email and password
2. System validates email exists in database
3. System compares provided password with stored hash using bcrypt
4. If valid, system generates JWT token and creates access token record
5. Returns authentication response with token and user information

### 2. Token Usage
```bash
# Use the token in subsequent requests
GET /api/v1/protected-endpoint
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Token Validation
- Tokens are validated on each protected endpoint request
- Token expiration is checked automatically
- Invalid or expired tokens return 401 Unauthorized

## Security Features

### Password Security
- **Bcrypt hashing:** Industry-standard password hashing
- **Salt generation:** Automatic salt generation for each password
- **Secure comparison:** Use of bcrypt.compare() for password verification
- **No plain text storage:** Passwords are never stored in plain text

### Token Security
- **JWT (JSON Web Tokens):** Stateless authentication tokens
- **Token expiration:** Configurable token expiration times
- **Secure signing:** Tokens signed with secret key
- **Random UUID:** Unique client IDs for each session

### Database Security
- **OAuth Access Tokens Table:** Secure token storage
- **Session management:** Track active sessions
- **Token revocation:** Ability to revoke tokens when needed

## Token Structure

### JWT Payload
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "iat": 1625097600,
  "exp": 1625184000
}
```

### Access Token Record
```sql
INSERT INTO oauth_access_tokens (
    id,                    -- UUID
    user_id,              -- User identifier
    client_id,            -- Client identifier (same as user_id)
    name,                 -- "Personal Access Token"
    scopes,               -- NULL (future use)
    revoked,              -- false
    created_at,           -- Current timestamp
    updated_at,           -- Current timestamp
    expires_at            -- Token expiration time
);
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required fields: email, password"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Wrong Email."
}
```

```json
{
  "success": false,
  "message": "Wrong Password."
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "User session already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Authentication service temporarily unavailable"
}
```

## Configuration

### Environment Variables
```bash
# JWT Configuration
APP_SECRET_KEY=your-super-secret-jwt-key
LOGIN_EXP=24h  # Token expiration time

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

### Token Expiration
- **Default:** 24 hours
- **Configurable:** Via LOGIN_EXP environment variable
- **Format:** Supports moment.js duration formats (e.g., '24h', '7d', '30m')

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### OAuth Access Tokens Table
```sql
CREATE TABLE oauth_access_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    client_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    scopes TEXT,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);
```

## Rate Limiting

Authentication endpoints are subject to rate limiting to prevent brute force attacks:
- **Login attempts:** 5 attempts per 15 minutes per IP
- **Failed login tracking:** Temporary account lockout after multiple failures
- **IP-based limiting:** Additional protection against distributed attacks

## Security Best Practices

### Password Requirements
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers, and symbols
- No common dictionary words
- No user information (name, email) in password

### Token Management
- Store tokens securely on client-side
- Implement automatic token refresh
- Clear tokens on logout
- Use HTTPS for all authentication requests

### Session Security
- Implement session timeout
- Track active sessions
- Provide session management for users
- Log authentication events

## Integration Examples

### Frontend Integration
```javascript
// Login function
const login = async (email, password) => {
    try {
        const response = await fetch('/api/v1/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Store token securely
            localStorage.setItem('authToken', result.data.token);
            localStorage.setItem('tokenExpiry', result.data.expireDate);
            return result.data;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

// Check token expiration
const isTokenExpired = () => {
    const expiry = localStorage.getItem('tokenExpiry');
    return !expiry || new Date() > new Date(expiry);
};

// Logout function
const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
    // Optionally call logout endpoint to revoke token
};
```

### Backend Integration
```javascript
// Middleware for protected routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access token required' 
        });
    }
    
    jwt.verify(token, process.env.APP_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                success: false, 
                message: 'Invalid or expired token' 
            });
        }
        req.user = user;
        next();
    });
};
```

## Monitoring and Logging

### Authentication Events
- Successful login attempts
- Failed login attempts
- Token generation
- Token expiration
- Account lockouts
- Password change events

### Security Alerts
- Multiple failed login attempts
- Login from new devices/locations
- Suspicious activity patterns
- Token manipulation attempts

## Testing

### Unit Tests
```javascript
describe('Authentication', () => {
    it('should authenticate valid user', async () => {
        const result = await authLogin({
            email: 'test@example.com',
            password: 'validPassword123'
        });
        expect(result.success).toBe(true);
        expect(result.data.token).toBeDefined();
    });
    
    it('should reject invalid email', async () => {
        const result = await authLogin({
            email: 'invalid@example.com',
            password: 'validPassword123'
        });
        expect(result.success).toBe(false);
        expect(result.message).toBe('Wrong Email.');
    });
});
```

### Integration Tests
- End-to-end authentication flow
- Token validation across endpoints
- Session management
- Security vulnerability tests

## Compliance

### Security Standards
- **OWASP Authentication Guidelines**
- **JWT Security Best Practices**
- **GDPR Compliance for user data**
- **SOC 2 Type II Security Controls**

### Audit Trail
- Complete authentication audit logs
- User session tracking
- Security event monitoring
- Compliance reporting capabilities
