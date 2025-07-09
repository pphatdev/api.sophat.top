import { Router } from 'express'
import { authenticateToken } from '../middlewares/authenticate.js'
import { Validation } from '../helpers/validator.js'
import {
    getRecommendations,
    addRecommendation,
    getUserRecommendations,
    getSimilarBooks
} from '../models/recommendations.js'

export const ROUTE = Router()

// Optional authentication middleware (uncomment if needed)
// ROUTE.use((req, res, next) => authenticateToken(req, res, next))

/**
 * GET /recommendations
 * Get general book recommendations
 * Query params:
 * - type: 'popular', 'trending', 'similar', 'personalized' (default: 'popular')
 * - limit: number of recommendations (default: 10)
 * - category: filter by category
 * - user_id: for personalized recommendations
 */
ROUTE.get("/",
    async (req, res) => {
        try {
            const response = await getRecommendations(req.query)
            res.send(response)
        } catch (error) {
            console.error('Error in recommendations route:', error)
            res.status(500).send({ message: 'Internal server error' })
        }
    }
)

/**
 * GET /recommendations/user/:user_id
 * Get personalized recommendations for a specific user
 * Query params:
 * - limit: number of recommendations (default: 10)
 * - category: filter by category
 */
ROUTE.get("/user/:user_id",
    Validation.base.detail,
    async (req, res) => {
        try {
            const { user_id } = req.params;
            const response = await getUserRecommendations({ user_id, ...req.query })
            res.send(response)
        } catch (error) {
            console.error('Error in user recommendations route:', error)
            res.status(500).send({ message: 'Internal server error' })
        }
    }
)

/**
 * GET /recommendations/book/:book_id/similar
 * Get similar books for a specific book
 * Query params:
 * - limit: number of similar books (default: 10)
 */
ROUTE.get("/book/:book_id/similar",
    Validation.base.detail,
    async (req, res) => {
        try {
            const { book_id } = req.params;
            const response = await getSimilarBooks({ book_id, ...req.query })
            res.send(response)
        } catch (error) {
            console.error('Error in similar books route:', error)
            res.status(500).send({ message: 'Internal server error' })
        }
    }
)

/**
 * GET /recommendations/popular
 * Get popular book recommendations
 * Query params:
 * - limit: number of recommendations (default: 10)
 * - category: filter by category
 */
ROUTE.get("/popular",
    async (req, res) => {
        try {
            const response = await getRecommendations({ ...req.query, type: 'popular' })
            res.send(response)
        } catch (error) {
            console.error('Error in popular recommendations route:', error)
            res.status(500).send({ message: 'Internal server error' })
        }
    }
)

/**
 * GET /recommendations/trending
 * Get trending book recommendations
 * Query params:
 * - limit: number of recommendations (default: 10)
 * - category: filter by category
 */
ROUTE.get("/trending",
    async (req, res) => {
        try {
            const response = await getRecommendations({ ...req.query, type: 'trending' })
            res.send(response)
        } catch (error) {
            console.error('Error in trending recommendations route:', error)
            res.status(500).send({ message: 'Internal server error' })
        }
    }
)

/**
 * POST /recommendations
 * Add a new recommendation
 * Body params:
 * - user_id: optional user ID
 * - book_id: required book ID
 * - recommendation_type: type of recommendation (default: 'similar')
 * - recommendation_score: score between 0 and 1 (default: 0.5)
 * - reason: reason for recommendation
 */
ROUTE.post("/",
    async (req, res) => {
        try {
            const response = await addRecommendation(req.body)
            res.send(response)
        } catch (error) {
            console.error('Error in add recommendation route:', error)
            res.status(500).send({ message: 'Internal server error' })
        }
    }
)

export default ROUTE
