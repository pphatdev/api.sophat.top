import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { authenticateToken } from '../middlewares/authenticate.js'
import { getImage, create, uploadSingle } from '../controllers/images.js'
import { Validation } from '../helpers/validator.js'
import ImageModel from '../models/images.js'

// Set up rate limiter: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})

export const ROUTE = Router()
ROUTE.use(limiter)
ROUTE.get("/", Validation.base.list, async (req, res) => {
    const response = await ImageModel.getData(req.query)
    res.send(response)
})

ROUTE.get("/:folder/:filename", getImage)

ROUTE.get("/:id", Validation.base.detail, (req, res) => {
    const { id } = req.params
    ImageModel.getDataDetail({ id })
        .then(response => res.send(response))
        .catch(error => res.status(500).send({ error: error.message }))
})

ROUTE.use((req, res, next) => authenticateToken(req, res, next))

ROUTE.post("/upload", uploadSingle, create)


export default ROUTE