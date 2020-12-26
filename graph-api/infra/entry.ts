#!/usr/bin/env node

import 'source-map-support/register'

import { ApiStack } from './stacks/api-stack'
import { App } from '@aws-cdk/core'

const app = new App()

new ApiStack(app, `sc-graph-api-${process.env.STAGE ?? 'dev'}`, {
  env: {
    region: 'ap-northeast-2',
  },
  description: 'Create by CDK',
})
