import { InstanceName, Jwt, Provider, ProviderDescriptor } from 'graphity'

import { HashupLabAuthBuilder } from '../app/auth-builder'


export class AuthProvider implements Provider {
  public register(app: ProviderDescriptor): void {
    app.resolver(Jwt, () => new Jwt({
      algorithm: 'HS512',
      secret: process.env.JWT_SECRET ?? '',
    }))
    app.bind(InstanceName.AuthBuilder, HashupLabAuthBuilder)
  }
}
