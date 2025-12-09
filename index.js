import express from 'express'
import ROUTE from './src/routes/index.js'
import { Response } from './src/helpers/response-data.js'
import { ENV, PORT } from './src/db/configs/index.js'

const app = express()

// app.use(cors({
//     origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }))

app.use((req, res, next) => {
    const allowedOrigins = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        /^https?:\/\/.*\.sophat\.top$/,
        /^https?:\/\/.*\.nintrea\.top$/,
        /^https?:\/\/.*\.pphat\.top$/,
        /^https?:\/\/pphat\.vercel\.app$/,
        /^https?:\/\/v4-pphat\.vercel\.app$/,
        /^https?:\/\/v4-[a-z0-9]+-pphat\.vercel\.app$/,
        /^https?:\/\/v4-[a-z0-9]+-[a-z0-9]+-pphat\.vercel\.app$/,
	/^https?:\/\/(.*\.)?stackdev\.cloud$/
    ];

    const origin = req.headers.origin;
    if (origin) {
        const isAllowed = allowedOrigins.some(allowed =>
            typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
        );

        if (isAllowed) {
            res.header('Access-Control-Allow-Origin', origin);
        }
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }
    next()
})

// Configure trust proxy for accurate client IP detection with rate limiting
app.set('trust proxy', 1)

app.use(ROUTE)


// Defualt End point
app.get('/', (req, res) => {
    res.send(Response.success(req.query))
})


app.listen(PORT, () => {
    console.log(`\n♻️  Starting with: [\x1b[35m${ENV}\x1b[0m\] Mode!`)
    console.log(`\n🌞  API development:`)
    console.log(`🚀 \x1b[30mLocalhost:\x1b[32m http://localhost:${PORT}/api/v1/\x1b[0m`)
    console.log(`🚀 \x1b[30mLocal Service:\x1b[32m http://127.0.0.1:${PORT}/api/v1/\x1b[0m`)
})


/**
 * Not Found Route
*/
app.all("*", (req, res) => {
    res.send(
        Response.notFound({
            title: `Welcome to API NINTREA LABS`,
            method: req.method,
            message: `The requested URL ${req.originalUrl} was not found on this server.`,
        })
    )
})

export default app
