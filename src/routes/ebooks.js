import { Router } from 'express'
import { authenticateToken } from '../middlewares/authenticate.js'
import { Validation } from '../helpers/validator.js'
import { getData, getDataByAuthor, getDataDetail, getRelatedData, insertData, updateData } from '../models/ebooks.js'
import { uploadSingle } from '../controllers/images.js'
export const ROUTE = Router()

// ROUTE.use((req, res, next) => authenticateToken(req, res, next))

/**
 * POST /ebooks
 * Add a new ebook
 * Body params:
 * - title: Title of the ebook
 * - subtitle: Subtitle of the ebook
 * - author: Author of the ebook
 * - publisher: Publisher of the ebook
 * - isbn: ISBN of the ebook
 * - description: Description of the ebook
 * - category: Category of the ebook
 * - language: Language of the ebook
 * - page_count: Number of pages
 * - price: Price of the ebook
 * - publication_date: Publication date
 * - rating: Rating of the ebook (default: 0)
 * - file: PDF file upload (required)
 * Returns:
 * - file_size_mb: File size in MB
 * - file_path: Path to stored file
 * - file_format: File format (pdf)
 * - cover_image_url: URL to cover image
 */
ROUTE.post("/",
    uploadSingle,
    async (req, res) => {
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded." });
        }

        const response = await insertData({...req.body, file: req.file})
        res.send(response)
    }
)

/**
 * GET /ebooks
 * Get a list of ebooks
 * Query params:
 * - category: filter by category
 * - page: page number (default: 1)
 * - limit: number of items per page (default: 10)
 * - search: search term for title, description, subtitle, or author
 * - sort: sorting criteria (default: 'asc')
 */
ROUTE.get("/",
    Validation.base.list,
    async (req, res) => {
        try {
            const response = await getData(req.query)
            res.send(response)
        } catch (error) {
            console.error('Error in ebooks route:', error)
            res.status(500).send({ message: 'Internal server error' })
        }
    }
)

/**
 * GET /ebooks/:id
 * Get details of a specific ebook
 * Params:
 * - id: ID of the ebook
 */
ROUTE.get("/:id",
    Validation.base.detail,
    async (req, res) => {
        const response = await getDataDetail(req.params)
        res.send(response)
    }
)


/**
 * GET /ebooks/:id/related
 * Get related ebooks for a specific ebook
 * Params:
 * - id: ID of the ebook
 * Query params:
 * - category: filter by category
 * - page: page number (default: 1)
 * - limit: number of items per page (default: 10)
 * - search: search term for title, description, subtitle, or author
 */
ROUTE.get("/related/:id",
    Validation.base.detail,
    async (req, res) => {
        try {
            const { id } = req.params;
            const response = await getRelatedData({ id, ...req.query })
            res.send(response)
        } catch (error) {
            console.error('Error in related ebooks route:', error)
            res.status(500).send({ message: 'Internal server error' })
        }
    }
)

/**
 * GET /ebooks/category/:authorId
 * Get ebooks for a specific user
 * Params:
 * - authorId: ID of the user
 * Query params:
 * - category: filter by category (default: 'all')
 * - page: page number (default: 1)
 * - limit: number of items per page (default: 10)
 * - search: search term for title, description, subtitle, or author
 */
ROUTE.get("/category/:authorId",
    async (req, res) => {
        try {
            const response = await getDataByAuthor({ ...req.query, ...req.params })
            res.send(response)
        } catch (error) {
            console.error('Error in ebooks route:', error)
            res.status(500).send({ message: 'Internal server error' })
        }
    }
)

// ROUTE.patch("/",
//     uploadSingle,
//     async (req, res) => {
//         const response = await updateData(req.body)
//         res.send(response)
//     }
// )

export default ROUTE