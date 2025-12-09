import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { authenticateToken } from '../middlewares/authenticate.js'
import { Validation } from '../helpers/validator.js'
import { getData, getDataDetail, insertData, updateData } from '../models/posts.js'
import { Controller } from '../helpers/response/controller.js'

// Set up rate limiter: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

export const ROUTE = Router()

ROUTE.use(limiter)

ROUTE.use((req, res, next) => authenticateToken(req, res, next))

ROUTE.post("/",
    async (req, res) => {
        const response = await insertData(req.body)
        res.send(response)
    }
)

ROUTE.get("/",
    Validation.base.list,
    async (req, res) => {
        const response = await getData(req.query)
        res.send(response)
    }
)

ROUTE.get("/:id", async (req, res) => Controller.getOnce(req, res, getDataDetail))

ROUTE.put("/",
    async (req, res) => {
        const response = await updateData(req.body)
        res.send(response)
    }
)

export default ROUTE