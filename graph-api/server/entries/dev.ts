import { ServerExpress } from '@graphity/server-express'

import { createGraphityApp } from '../app/create-graphity-app'


const APP_PORT = process.env.APP_PORT ?? '3000'

const server = new ServerExpress(createGraphityApp())

server.start(+APP_PORT)
