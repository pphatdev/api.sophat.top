import { Router } from 'express'
import { authenticateToken } from '../middlewares/authenticate.js'
import { Validation } from '../helpers/validator.js'
import { getData, getDataDetail, insertData, updateData, deleteData } from '../models/authors.js'
import { uploadSingle } from '../controllers/images.js'

export const ROUTE = Router()

// ROUTE.use((req, res, next) => authenticateToken(req, res, next))

ROUTE.post("/",
    uploadSingle,
    async (req, res) => {
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
    Validation.base.id,
    async (req, res) => {
        const response = await getDataDetail(req.params)
        res.send(response)
    }
)

ROUTE.patch("/:id",
    uploadSingle,
    async (req, res) => {

        // validate author_id
        if (!req.params.id || isNaN(req.params.id)) {
            return res.status(400).send({ message: "Invalid author ID." })
        }

        const response = await updateData({...req.body, author_id: req.params.id, file: req.file})
        res.send(response)
    }
)

ROUTE.delete("/:id",
    Validation.base.id,
    async (req, res) => {
        const response = await deleteData(req.params)
        res.send(response)
    }
)

export default ROUTE
