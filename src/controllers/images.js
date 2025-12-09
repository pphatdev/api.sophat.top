import { upload } from "../middlewares/image.js"
import sharp from 'sharp'
import path from 'path'
import ip from 'ip'
import ImageModel from "../models/images.js"

import { createReadStream, promises as fs } from 'fs'
import { Response } from "../helpers/response-data.js"
import { PORT, VERSION } from "../db/configs/index.js"
import { ImageCache } from "../helpers/utils/caches/images.js"
import { paramsToNameFile } from "../helpers/utils/convertion/string.js"

const { getData, insertData } = ImageModel

export const uploadSingle = upload.single('file')


export const notFoundImage = (option = { width: 300, height: 300 }) => {
    const { width, height, isDark } = option
    return Buffer.from(`
        <svg width="${width}" height="${height}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="${width}" height="${height}" fill="currentColor"/>
            <path d="M60.02 54.82L56.89 47.5C56.32 46.16 55.47 45.4 54.5 45.35C53.54 45.3 52.61 45.97 51.9 47.25L50 50.66C49.6 51.38 49.03 51.81 48.41 51.86C47.78 51.92 47.15 51.59 46.64 50.94L46.42 50.66C45.71 49.77 44.83 49.34 43.93 49.43C43.03 49.52 42.26 50.14 41.75 51.15L40.02 54.6C39.4 55.85 39.46 57.3 40.19 58.48C40.92 59.66 42.19 60.37 43.58 60.37H56.34C57.68 60.37 58.93 59.7 59.67 58.58C60.43 57.46 60.55 56.05 60.02 54.82Z" fill="#AEB7BE"/>
            <path d="M44.97 46.38C46.8367 46.38 48.35 44.8667 48.35 43C48.35 41.1333 46.8367 39.62 44.97 39.62C43.1032 39.62 41.59 41.1333 41.59 43C41.59 44.8667 43.1032 46.38 44.97 46.38Z" fill="#AEB7BE"/>
        </svg>
    `,)
}


export const create = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json(Response.insetFailed('No file uploaded'))
        }

        const fileData = {
            id: (req.file.filename).split('.')[0],
            filename: req.file.filename,
            original_name: req.file.originalname,
            mime_type: req.file.mimetype,
            size: req.file.size,
            path: `http://${ip.address()}:${PORT}/api/${VERSION}/files/image/${req.file.filename}`
        }

        return res.json(await insertData(fileData))

    } catch (error) {
        console.error('Upload error:', error)
        return res.status(500).json(
            Response.insetFailed('Error uploading file')
        )
    }
}


const imageCache = new ImageCache({ ttl: 3600 }); // 1 hour cache

export const getImage = async (req, res) => {
    try {
        const { filename, folder } = req.params;
        const { fm, q, w, h, fit } = req.query;
        const rootDir = path.join(process.cwd(), `public/uploads/${folder || 'images'}`);
        const filePath = path.resolve(rootDir, filename);

        // Security check for path traversal
        if (!filePath.startsWith(rootDir)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        // Check if any transformation is requested
        const hasTransformation = !!(fm || q || w || h || fit);

        // Create a cache key based on the image parameters
        const cacheKey = `_file_${paramsToNameFile({...req.params, ...req.query})}`;

        let fileExists = false;
        let fileStats = null;
        let originalMetadata = null;

        try {
            fileStats = await fs.stat(filePath);
            fileExists = true;

            // Get original image metadata for proper content-type detection
            if (!hasTransformation) {
                originalMetadata = await sharp(filePath).metadata();
            }
        } catch (error) {
            fileExists = false;
        }

        // If no transformation and file exists, serve original file with proper headers
        if (!hasTransformation && fileExists && originalMetadata) {
            // Determine content type from metadata
            let contentType = 'image/jpeg'; // default
            switch (originalMetadata.format) {
                case 'jpeg':
                    contentType = 'image/jpeg';
                    break;
                case 'png':
                    contentType = 'image/png';
                    break;
                case 'webp':
                    contentType = 'image/webp';
                    break;
                case 'gif':
                    contentType = 'image/gif';
                    break;
                case 'svg':
                    contentType = 'image/svg+xml';
                    break;
                case 'tiff':
                    contentType = 'image/tiff';
                    break;
                default:
                    contentType = 'image/jpeg';
            }

            // Set proper headers for browser caching and preview
            const etag = `"${fileStats.mtime.getTime()}-${fileStats.size}"`;
            res.set({
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'ETag': etag,
                'Last-Modified': fileStats.mtime.toUTCString(),
                'Content-Length': fileStats.size.toString(),
                'Connection': 'keep-alive',
                'Date': new Date().toUTCString(),
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'SAMEORIGIN',
                'X-XSS-Protection': '1; mode=block'
            });

            // Check if client has cached version
            const ifNoneMatch = req.headers['if-none-match'];
            const ifModifiedSince = req.headers['if-modified-since'];

            if (ifNoneMatch === etag || (ifModifiedSince && new Date(ifModifiedSince) >= fileStats.mtime)) {
                return res.status(304).end();
            }

            // Stream the original file
            const fileStream = createReadStream(filePath);
            return fileStream.pipe(res);
        }

        // For transformed images, check cache first
        const outputFormat = fm || (originalMetadata?.format === 'png' ? 'png' : 'jpeg');
        const cachedImage = await imageCache.getImage(cacheKey, `.${outputFormat}`);
        if (cachedImage) {
            const contentType = outputFormat === 'png' ? 'image/png' : 
                             outputFormat === 'webp' ? 'image/webp' : 'image/jpeg';
            res.set({
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'SAMEORIGIN',
                'X-XSS-Protection': '1; mode=block',
                'Connection': 'keep-alive',
                'Date': new Date().toUTCString(),
                'ETag': `"${Date.now()}-${cachedImage.length}"`,
                'Last-Modified': new Date().toUTCString(),
                'Content-Length': cachedImage.length.toString()
            });
            return res.send(cachedImage);
        }

        let transform = sharp();
        let fileStream = null;

        if (fileExists) {
            fileStream = createReadStream(filePath);
        } else {
            // Generate placeholder if file not found
            const width = w ? parseInt(w) : 300;
            const height = h ? parseInt(h) : width;

            transform = sharp({
                create: {
                    width,
                    height,
                    channels: 4,
                    background: { r: 200, g: 200, b: 200, alpha: 1 }
                }
            })
                .composite([{
                    input: notFoundImage({ width, height }),
                    top: 0,
                    left: 0
                }]);
        }

        // Apply transformations
        if (w || h) {
            transform = transform.resize({
                width: w ? parseInt(w) : undefined,
                height: h ? parseInt(h) : undefined,
                fit: fit || 'cover'
            });
        }

        // Set output format and quality
        if (fm) {
            const quality = q ? parseInt(q) : (fm === 'jpeg' ? 85 : 80);
            transform = transform.toFormat(fm, { quality });
        } else {
            // Use original format if no transformation, otherwise default to appropriate format
            const quality = q ? parseInt(q) : 85;
            if (originalMetadata?.format === 'png') {
                transform = transform.png({ quality });
            } else {
                transform = transform.jpeg({ quality });
            }
        }

        // Create a buffer from the transformed image
        let imageBuffer;
        if (fileStream) {
            imageBuffer = await fileStream.pipe(transform).toBuffer();
        } else {
            imageBuffer = await transform.toBuffer();
        }

        // Cache the transformed image
        await imageCache.saveImage(cacheKey, imageBuffer, `.${outputFormat}`);

        // Set response headers
        const contentType = outputFormat === 'png' ? 'image/png' : outputFormat === 'webp' ? 'image/webp' : 'image/jpeg';
        res.set({
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'SAMEORIGIN',
            'X-XSS-Protection': '1; mode=block',
            'Connection': 'keep-alive',
            'Date': new Date().toUTCString(),
            'ETag': `"${Date.now()}-${imageBuffer.length}"`,
            'Last-Modified': new Date().toUTCString(),
            'Content-Length': imageBuffer.length.toString()
        });

        res.send(imageBuffer);

    } catch (error) {
        console.error('Image processing error:', error);

        // For image requests, serve a placeholder instead of JSON error
        if (req.headers.accept && req.headers.accept.includes('image/')) {
            const width = 300;
            const height = 300;
            const placeholderSvg = notFoundImage({ width, height });

            res.set({
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'no-cache',
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'SAMEORIGIN',
                'X-XSS-Protection': '1; mode=block'
            });
            return res.send(placeholderSvg);
        }

        res.status(500).json({ error: error.message });
    }
}


export const get = async (req, res) => {

    const { page = 1, search, sort = 'asc', limit = -1 } = { ...req?.query, ...req?.body };
    if (!Number(limit))
        limit = null

    const fetchData = await getData({
        page: page,
        limit: parseInt(limit),
        search: search,
        sort: sort
    });

    res.json(fetchData);
};
