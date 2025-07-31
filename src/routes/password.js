import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { authenticateToken } from '../middlewares/authenticate.js'
import { Validation } from '../helpers/validator.js'
import PasswordModel from '../models/password.js'
import { Controller } from '../helpers/response/controller.js'

// Rate limiter: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const { getData, getDataDetail, updateData } = PasswordModel

export const ROUTE = Router()

// Apply rate limiter to all routes in this router
ROUTE.use(limiter)

ROUTE.use((req, res, next) => authenticateToken(req, res, next))

ROUTE.get("/",
    Validation.base.list,
    async (req, res) => {
        const data = await getData(req.query)
        res.send(data)
    }
)

ROUTE.get("/:id", async (req, res) => Controller.getOnce(req, res, getDataDetail))

ROUTE.put("/", async (req, res) => {
    const data = await updateData(req.body)
    res.send(data)
})

export default ROUTE