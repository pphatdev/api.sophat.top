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

        if (!filePath.startsWith(rootDir)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const cacheKey = `_file_${paramsToNameFile({...req.params, ...req.query})}`;

        // Try to get from cache first
        const cachedImage = await imageCache.getImage(cacheKey, '.png');
        if (cachedImage) {
            res.set('Content-Type', 'image/png');
            return res.send(cachedImage);
        }

        let transform = sharp();
        let fileStream;

        try {
            await fs.access(filePath);
            fileStream = createReadStream(filePath);
        } catch (error) {
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

        if (w || h) {
            transform = transform.resize({
                width: w ? parseInt(w) : undefined,
                height: h ? parseInt(h) : undefined,
                fit: fit || 'cover'
            });
        }

        if (fm) {
            transform = transform.toFormat(fm, {
                quality: q ? parseInt(q) : 60
            });
        } else {
            transform = transform.png();
        }

        // Create a buffer from the transformed image
        let imageBuffer;
        if (fileStream) {
            imageBuffer = await fileStream.pipe(transform).toBuffer();
        } else {
            imageBuffer = await transform.toBuffer();
        }

        // Cache the transformed image
        await imageCache.saveImage(cacheKey, imageBuffer, '.png');

        // Send the response
        res.set('Content-Type', 'image/png');
        res.send(imageBuffer);

    } catch (error) {
        console.error('Image processing error:', error);
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
