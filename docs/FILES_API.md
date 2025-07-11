# Files/Images API Documentation

## Overview
The Files/Images API provides comprehensive file and image management services including upload, storage, retrieval, and processing capabilities. This API supports multiple image formats, automatic optimization, and secure file handling.

## Base URL
```
/api/v1/files
```

## Endpoints

### 1. Get All Images
**GET** `/api/v1/files`

Retrieves a paginated list of all uploaded images and files.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `search` (optional): Search term for filename or metadata
- `sort` (optional): Sort order (asc/desc)

**Example Request:**
```bash
GET /api/v1/files?page=1&limit=10&search=avatar
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "avatar-12345.jpg",
      "original_name": "user-avatar.jpg",
      "mime_type": "image/jpeg",
      "size": 245760,
      "path": "/images/uploads/avatar-12345.jpg",
      "folder": "uploads",
      "created_date": "2025-07-11T10:30:00Z",
      "updated_date": "2025-07-11T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### 2. Get File by ID
**GET** `/api/v1/files/:id`

Retrieves detailed information about a specific file.

**Path Parameters:**
- `id` (required): The file's unique identifier

**Example Request:**
```bash
GET /api/v1/files/550e8400-e29b-41d4-a716-446655440000
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "avatar-12345.jpg",
    "original_name": "user-avatar.jpg",
    "mime_type": "image/jpeg",
    "size": 245760,
    "path": "/images/uploads/avatar-12345.jpg",
    "folder": "uploads",
    "metadata": {
      "width": 800,
      "height": 600,
      "format": "JPEG",
      "quality": 85
    },
    "created_date": "2025-07-11T10:30:00Z",
    "updated_date": "2025-07-11T10:30:00Z"
  }
}
```

### 3. Retrieve File/Image
**GET** `/api/v1/files/:folder/:filename`

Retrieves the actual file or image with optional processing parameters.

**Path Parameters:**
- `folder` (required): The folder name where the file is stored
- `filename` (required): The filename to retrieve

**Query Parameters:**
- `w` (optional): Width for image resizing
- `h` (optional): Height for image resizing
- `q` (optional): Quality (1-100) for image compression
- `format` (optional): Output format (webp, jpg, png, avif)
- `fit` (optional): Resize mode (cover, contain, fill, inside, outside)

**Example Request:**
```bash
GET /api/v1/files/uploads/avatar-12345.jpg?w=200&h=200&q=80&format=webp
```

**Example Response:**
```
[Binary image data with appropriate headers]
Content-Type: image/webp
Content-Length: 8456
Cache-Control: public, max-age=31536000
```

### 4. Upload File
**POST** `/api/v1/files/upload`

Uploads a new file or image to the server.

**Authentication:** Required

**Content-Type:** `multipart/form-data`

**Request Body:**
- `file` (required): The file to upload
- `folder` (optional): Target folder (default: "uploads")
- `description` (optional): File description

**Example Request:**
```bash
POST /api/v1/files/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}

{
  "file": [File data],
  "folder": "avatars",
  "description": "User profile picture"
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "avatar-67890.jpg",
    "original_name": "profile-pic.jpg",
    "mime_type": "image/jpeg",
    "size": 512000,
    "path": "/images/avatars/avatar-67890.jpg",
    "url": "/api/v1/files/avatars/avatar-67890.jpg"
  }
}
```

## Supported File Types

### Images
- **JPEG/JPG:** High compatibility, good compression
- **PNG:** Transparency support, lossless compression
- **WebP:** Modern format, excellent compression
- **AVIF:** Next-generation format, superior compression
- **GIF:** Animation support, limited colors
- **SVG:** Vector graphics, scalable

### Documents
- **PDF:** Portable document format
- **DOC/DOCX:** Microsoft Word documents
- **TXT:** Plain text files
- **CSV:** Comma-separated values

### Archives
- **ZIP:** Compressed archives
- **RAR:** WinRAR archives
- **7Z:** 7-Zip archives

## Image Processing Features

### Automatic Optimization
- **Compression:** Automatic quality optimization
- **Format conversion:** Convert to modern formats
- **Metadata removal:** Strip EXIF data for privacy
- **Progressive loading:** Generate progressive JPEGs

### Resizing Options
- **Cover:** Maintain aspect ratio, crop if necessary
- **Contain:** Maintain aspect ratio, fit within bounds
- **Fill:** Stretch to exact dimensions
- **Inside:** Resize to fit inside dimensions
- **Outside:** Resize to fit outside dimensions

### Quality Control
- **Adaptive quality:** Adjust quality based on image content
- **Size optimization:** Balance quality vs file size
- **Format selection:** Choose optimal format automatically

## File Storage Structure

### Directory Organization
```
public/
├── uploads/
│   ├── images/
│   ├── documents/
│   └── archives/
├── authors/
│   └── profile-images/
├── projects/
│   └── thumbnails/
└── ebooks/
    ├── covers/
    └── samples/
```

### Filename Convention
- **Format:** `{category}-{uuid}.{extension}`
- **Example:** `avatar-550e8400-e29b-41d4-a716-446655440000.jpg`
- **Benefits:** Unique names, no conflicts, easy organization

## Security Features

### File Validation
- **MIME type verification:** Ensure file type matches extension
- **File size limits:** Prevent oversized uploads
- **Malicious file detection:** Scan for potential threats
- **Extension whitelist:** Only allow approved file types

### Access Control
- **Authentication required:** For upload operations
- **Permission checks:** Verify user permissions
- **Rate limiting:** Prevent abuse of upload endpoints
- **IP-based restrictions:** Additional security layer

### Secure Storage
- **Path sanitization:** Prevent directory traversal attacks
- **Filename sanitization:** Remove dangerous characters
- **Virus scanning:** Optional antivirus integration
- **Backup systems:** Regular file backups

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "No file uploaded or invalid file type"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required for file upload"
}
```

### 413 Payload Too Large
```json
{
  "success": false,
  "message": "File size exceeds maximum limit of 10MB"
}
```

### 415 Unsupported Media Type
```json
{
  "success": false,
  "message": "File type not supported. Allowed: jpg, png, pdf, doc"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to process file upload"
}
```

## Configuration

### File Size Limits
```javascript
const fileSizeLimits = {
    images: 10 * 1024 * 1024,      // 10MB
    documents: 50 * 1024 * 1024,   // 50MB
    archives: 100 * 1024 * 1024,   // 100MB
    videos: 500 * 1024 * 1024      // 500MB
};
```

### Allowed File Types
```javascript
const allowedTypes = {
    images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg'],
    documents: ['pdf', 'doc', 'docx', 'txt', 'csv', 'xlsx'],
    archives: ['zip', 'rar', '7z', 'tar', 'gz']
};
```

## Performance Optimization

### Caching Strategy
- **Browser caching:** Long-term caching for static files
- **CDN integration:** Global content delivery
- **Image optimization:** Automatic format and quality optimization
- **Lazy loading:** Progressive image loading

### Image Processing
- **Sharp library:** High-performance image processing
- **Background processing:** Async image optimization
- **Multiple formats:** Generate multiple format versions
- **Thumbnail generation:** Create various sizes automatically

## API Usage Examples

### Upload Image with Processing
```javascript
const uploadImage = async (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', options.folder || 'uploads');
    
    const response = await fetch('/api/v1/files/upload', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    
    return response.json();
};
```

### Get Optimized Image
```javascript
const getOptimizedImage = (folder, filename, options = {}) => {
    const params = new URLSearchParams({
        w: options.width || 800,
        h: options.height || 600,
        q: options.quality || 85,
        format: options.format || 'webp',
        fit: options.fit || 'cover'
    });
    
    return `/api/v1/files/${folder}/${filename}?${params}`;
};
```

### Image Gallery Implementation
```javascript
const ImageGallery = ({ images }) => {
    return (
        <div className="image-gallery">
            {images.map(image => (
                <img
                    key={image.id}
                    src={getOptimizedImage(image.folder, image.filename, {
                        width: 300,
                        height: 200,
                        quality: 80
                    })}
                    alt={image.original_name}
                    loading="lazy"
                />
            ))}
        </div>
    );
};
```

## Monitoring and Analytics

### File Usage Metrics
- Upload success/failure rates
- File size distribution
- Popular file types
- Storage usage trends
- Performance metrics

### Error Tracking
- Upload failures
- Processing errors
- Security violations
- Performance issues

## Database Schema

### Files Table
```sql
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size INTEGER NOT NULL,
    path VARCHAR(500) NOT NULL,
    folder VARCHAR(100) DEFAULT 'uploads',
    user_id UUID REFERENCES users(id),
    metadata JSONB,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes
```sql
CREATE INDEX idx_files_folder ON files(folder);
CREATE INDEX idx_files_mime_type ON files(mime_type);
CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_files_created_date ON files(created_date);
```

## Backup and Recovery

### File Backup Strategy
- **Regular backups:** Daily incremental backups
- **Cloud storage:** Multi-region redundancy
- **Version control:** Keep multiple file versions
- **Disaster recovery:** Automated recovery procedures

### Data Integrity
- **Checksums:** Verify file integrity
- **Duplication detection:** Prevent duplicate uploads
- **Corruption detection:** Monitor file health
- **Repair mechanisms:** Automatic corruption repair
