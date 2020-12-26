import { AuthBuilder, GraphityAuth, HttpRequest, Inject, Jwt } from 'graphity'


export class HashupLabAuthBuilder implements AuthBuilder {

  public constructor(
    @Inject(Jwt) public jwt: Jwt,
  ) {
  }

  public createToken(user: { id: string }): string {
    return this.jwt.sign({
      id: user.id,
    }, {
      expiresIn: '7d',
      audience: 'admin',
    })
  }

  public async buildAuth(request: HttpRequest): Promise<GraphityAuth | undefined> {
    const authorization = request.headers.authorization
    return Promise.resolve(undefined)
  }
}
