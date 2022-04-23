import { ServerLambda } from '@graphity/server-lambda'
import { APIGatewayProxyHandler } from 'aws-lambda'

import { createGraphityApp } from '../app/create-graphity-app'

let serverPromise = null as Promise<ServerLambda> | null
function getServer(): Promise<ServerLambda> {
  if (!serverPromise) {
    serverPromise = (async () => {
      return new ServerLambda(createGraphityApp(), {
        callbackWaitsForEmptyEventLoop: false,
        cors: {
          origin: [
            'https://moka.land',
            'https://moka.land',
          ],
          methods: [
            'OPTIONS',
            'HEAD',
            'GET',
            'POST',
          ],
          allowedHeaders: [
            'Authorization',
            'Content-Type',
          ],
        },
      })
    })()
  }
  return serverPromise
}

export const home: APIGatewayProxyHandler = async () => {
  return Promise.resolve({
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      message: 'pong',
      version: require('../package.json').version, // eslint-disable-line @typescript-eslint/no-require-imports
    }),
  })
}

export const graphql: APIGatewayProxyHandler = (event, context, callback) => {
  getServer().then(server => server.execute(event, context, callback))
}
