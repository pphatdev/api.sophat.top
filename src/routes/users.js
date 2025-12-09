import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { create, update, get , getOnce } from '../controllers/users.js'
import { authenticateToken } from '../middlewares/authenticate.js'
import { Validation } from '../helpers/validator.js'
import { getData } from '../models/users.js'

export const ROUTE = Router()

// Rate limiter: max 100 requests per 15 minutes per IP
const usersRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

ROUTE.use(usersRateLimiter)

ROUTE.post("/", async (req, res) => res.send(await create(req.body)) )

ROUTE.use((req, res, next) => authenticateToken(req, res, next))

ROUTE.get("/",
    Validation.base.list,
    async (req, res) => {
        const response = await getData(req.params)
        res.send(response)
    }
)

ROUTE.get("/:id",
    Validation.base.id,
    async (req, res) => {
        const response = await getOnce(req.params)
        res.send(response)
    }
)

ROUTE.put("/", async (req, res) => {
    const response = await update(req.body)
    res.send(response)
})

export default ROUTE