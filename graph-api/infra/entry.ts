import { App } from '@aws-cdk/core'

import { ApiStack } from './stacks/api-stack'

const app = new App()

new ApiStack(app, `sc-graph-api-${process.env.STAGE ?? 'dev'}`, {
  env: {
    region: 'ap-northeast-2',
  },
  description: 'Create by CDK',
})
