import { ContentHandling, EndpointType, LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway'
import { Certificate } from '@aws-cdk/aws-certificatemanager'
import { Rule, Schedule } from '@aws-cdk/aws-events'
import { LambdaFunction } from '@aws-cdk/aws-events-targets'
import { Code, Function as LFunction, Runtime } from '@aws-cdk/aws-lambda'
import { AaaaRecord, ARecord, HostedZone, RecordTarget } from '@aws-cdk/aws-route53'
import { ApiGateway as AliasApiGateway } from '@aws-cdk/aws-route53-targets'
import { Construct, Duration, Stack, StackProps } from '@aws-cdk/core'
import { join } from 'path'


const STAGE = process.env.STAGE ?? 'dev'

const JWT_SECRET = process.env.JWT_SECRET!

const AWS_ACM_ARN = process.env.AWS_ACM_ARN!
const AWS_ROUTE53_ZONE_ID = process.env.AWS_ROUTE53_ZONE_ID!

const DDB_TABLE_DATAS = process.env.DDB_TABLE_DATAS!

export class ApiStack extends Stack {
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const code = Code.fromAsset(join(__dirname, '../../dist'))

    const api = new RestApi(this, 'ApiGwRestApi', {
      restApiName: `${STAGE}-spellcheck-api`,
      domainName: {
        endpointType: EndpointType.EDGE,
        domainName: STAGE === 'prod' ? 'sc.moka.land' : 'sc.dev.moka.land',
        certificate: Certificate.fromCertificateArn(this, 'Certificate', AWS_ACM_ARN),
      },
      deployOptions: {
        stageName: STAGE,
      },
      defaultCorsPreflightOptions: {
        allowCredentials: true,
        allowOrigins: [
          'https://moka.land',
        ],
        allowMethods: [
          'OPTIONS',
          'HEAD',
          'GET',
          'POST',
        ],
        allowHeaders: [
          'Authorization',
          'Content-Type',
        ],
      },
      binaryMediaTypes: [
        'multipart/form-data',
      ],
    })

    const environment = {
      TZ: 'Asia/Seoul',

      JWT_SECRET,

      DDB_TABLE_DATAS,
    }

    const fnHome = new LFunction(this, 'HomeHandler', {
      functionName: `${STAGE}-sc-api-home`,
      runtime: Runtime.NODEJS_14_X,
      code,
      handler: 'entries/http.home',
      environment,
    })

    const fnGraphQL = new LFunction(this, 'GraphqlHandler', {
      functionName: `${STAGE}-sc-api-graphql`,
      runtime: Runtime.NODEJS_14_X,
      code,
      handler: 'entries/http.graphql',
      environment,
      timeout: Duration.seconds(120),
      memorySize: 1024,
    })

    api.root.addMethod('GET', new LambdaIntegration(fnHome))
    api.root.addResource('graphql').addMethod('ANY', new LambdaIntegration(fnGraphQL, {
      contentHandling: ContentHandling.CONVERT_TO_TEXT,
    }))


    new Rule(this, 'EventRuleHttpWarmer', {
      ruleName: `${STAGE}-sc-http-warmer`,
      schedule: Schedule.rate(Duration.minutes(5)),
      targets: [
        new LambdaFunction(fnHome),
        new LambdaFunction(fnGraphQL),
      ],
    })

    const zoneHashup = HostedZone.fromHostedZoneAttributes(this, 'ApiZone', {
      zoneName: 'moka.land',
      hostedZoneId: AWS_ROUTE53_ZONE_ID,
    })

    const apiRecordOptions = {
      recordName: STAGE === 'prod' ? 'sc.moka.land' : 'sc.dev.moka.land',
      zone: zoneHashup,
      target: RecordTarget.fromAlias(new AliasApiGateway(api)),
    }
    new ARecord(this, 'SpellCheckARecord', apiRecordOptions)
    new AaaaRecord(this, 'SpellCheckAaaaRecord', apiRecordOptions)
  }
}
