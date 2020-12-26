import { ServerLambda } from '@graphity/server-lambda'
import { APIGatewayProxyHandler } from 'aws-lambda'

import { createGraphityApp } from '../app/create-graphity-app'

const server = new ServerLambda(createGraphityApp(), {
  callbackWaitsForEmptyEventLoop: false,
  cors: {
    credentials: true,
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

export const home: APIGatewayProxyHandler = () => {
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
  server.execute(event, context, callback)
}
