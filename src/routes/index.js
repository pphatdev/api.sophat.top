import bodyParser from 'body-parser'

import { Router } from 'express'
import { VERSION } from '../db/configs/index.js'
import { ROUTE as USERS } from './users.js'
import { ROUTE as PASSWORD } from './password.js'
import { ROUTE as AUTH } from './auth.js'
import { ROUTE as FILES } from './images.js'
import { ROUTE as POSTS } from './posts.js'
import { ROUTE as PROJECTS } from './projects.js'
import { ROUTE as EBOOKS } from './ebooks.js'
import { ROUTE as AUTHORS } from './authors.js'
import { ROUTE as RECOMMENDATIONS } from './recommendations.js'

import { rateLimit } from 'express-rate-limit'

const API   = `/api/${VERSION}`
const ROUTE = Router()

ROUTE.use(`${API}/projects`, PROJECTS)


// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
// 	standardHeaders: 'draft-7',
// 	legacyHeaders: false
// })

/**
 * Define Body Parser
*/
ROUTE.use(bodyParser.urlencoded({ extended: true }))
ROUTE.use(bodyParser.json())

// ROUTE.use(limiter);

ROUTE.use(`${API}/auth`, AUTH)

ROUTE.use(`${API}/users`, USERS)

ROUTE.use(`${API}/files`, FILES)

ROUTE.use(`${API}/password`, PASSWORD)

ROUTE.use(`${API}/posts`, POSTS)

ROUTE.use(`${API}/ebooks`, EBOOKS)

ROUTE.use(`${API}/authors`, AUTHORS)

ROUTE.use(`${API}/recommendations`, RECOMMENDATIONS)

export default ROUTE