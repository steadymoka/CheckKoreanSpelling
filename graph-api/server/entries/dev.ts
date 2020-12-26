import { ServerExpress } from '@graphity/server-express'
import express, { json, urlencoded } from 'express'

import { createGraphityApp } from '../app/create-graphity-app'


const APP_PORT = process.env.APP_PORT ?? '3000'

const app = express()
app.use(json({ limit: '1mb' }))
app.use(urlencoded({ limit: '1mb' }))


const server = new ServerExpress(createGraphityApp(), app)

server.start(+APP_PORT)
