import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import productRoutes from "./products/index-sequelize.js"
import reviewRoutes from "./reviews/index-sequelize.js"
import categoryRoutes from "./category/index-sequelize.js"
import {
    badRequestErrorHandler,
    forbiddenErrorHandler,
    notFoundErrorHandler,
    catchAllErrorHandler
} from "./helpers/errorHandlers.js"
import db from './helpers/sequelize.js'

import createError from "http-errors"

const server = express()
const port = process.env.PORT || 3001

const whitelist = [process.env.FRONTEND_DEV_URL, /* process.env.FRONTEND_PROD_URL ,*/ "bypass"]
const corsOptions = {
    origin: (origin, next) => {
        try {
            if (whitelist.indexOf(origin) !== -1) {
                next(null, true)
            } else {
                next(createError(400, "Cross-Site Origin Policy blocked your request"), true)
            }
        } catch (error) {
            next(error)
        }
    }
}

server.use(cors(corsOptions))
server.use(express.json())

// ##### Global Middleware #####
server.use("/products", productRoutes)
server.use("/reviews", reviewRoutes)
server.use("/category", categoryRoutes);

server.use(badRequestErrorHandler)
server.use(forbiddenErrorHandler)
server.use(notFoundErrorHandler)
server.use(catchAllErrorHandler)
console.table(listEndpoints(server))
/* mongoose.connect("mongodb://localhost:27017/demobase", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    server.listen(port, () => {
        console.table(listEndpoints(server))
        console.log("server is running on port: ", port)
    })
})
 */

db.sequelize
    .sync({ force: false })
    .then(() => {
        server.listen(port, () => console.log('server is running on port', port))
    })
    .catch(e => {
        server.on(err => console.log(err))
    })