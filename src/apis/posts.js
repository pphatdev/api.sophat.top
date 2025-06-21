import { Router } from 'express'
import { create, update, get, getOnce } from '../controllers/posts.js'
import { authenticateToken } from '../middlewares/authenticate.js'
export const ROUTE = Router()

/**
 * Set authenticate
 */
ROUTE.use((req, res, next) => authenticateToken(req, res, next))


/**
 * Accept only request body
 */
ROUTE.post("/", async (req, res) => {
    const response = await create(req.body)
    res.send(response)
})


/**
 * Accept only request query
 */
ROUTE.get("/", async (req, res) => {
    const response = await get(req.query)
    res.send(response)
})

/**
 * Accept only params url id
 */
ROUTE.get("/:id", async (req, res) => {
    const response = await getOnce({id: req.params.id})
    res.send(response)
})

/**
 * Accept only request body
 */
ROUTE.put("/", async (req, res) => {
    const response = await update(req.body)
    res.send(response)
})


export default ROUTE