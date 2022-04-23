import { Graphity } from 'graphity'

import { HomeResolver } from '../resolvers/home-resolver'

export function createGraphityApp(): Graphity {
  const graphity = new Graphity({
    resolvers: [
      HomeResolver,
    ],
  })

  return graphity
}
