import { Router } from 'express'
import { authenticateToken } from '../middlewares/authenticate.js'
import { Validation } from '../helpers/validator.js'
import { getData, getDataDetail, getRelatedData, insertData, updateData } from '../models/ebooks.js'
import { uploadSingle } from '../controllers/images.js'
export const ROUTE = Router()

// ROUTE.use((req, res, next) => authenticateToken(req, res, next))

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

ROUTE.get("/",
    Validation.base.list,
    async (req, res) => {
        const response = await getData(req.query)
        res.send(response)
    }
)

ROUTE.get("/:id",
    Validation.base.detail,
    async (req, res) => {
        const response = await getDataDetail(req.params)
        res.send(response)
    }
)

ROUTE.get("/related/:id",
    Validation.base.detail,
    async (req, res) => {
        const response = await getRelatedData({ ...req.params, ...req.query })
        res.send(response)
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