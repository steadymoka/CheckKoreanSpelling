import { Graphity } from 'graphity'

import { AuthProvider } from '../providers/auth-provider'
import { HomeResolver } from '../resolvers/home-resolver'

export function createGraphityApp(): Graphity {
  const graphity = new Graphity({
    resolvers: [
      HomeResolver,
    ],
  })

  graphity.register(new AuthProvider())
  return graphity
}
