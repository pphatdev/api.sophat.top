import { Router } from 'express'
import { login } from '../controllers/auth.js'
import rateLimit from 'express-rate-limit'

// Rate limiter: max 5 login attempts per 15 minutes per IP
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: { error: "Too many login attempts, please try again later." }
})

export const ROUTE = Router()

ROUTE.post( "/", loginLimiter, async (req, res) => {
    const response = await login(req.body)
    res.send(response)
})

export default ROUTE