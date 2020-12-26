
module.exports = {
  local: {
    // dev
    APP_PORT: '8123',
    
    // cdk
    STAGE: 'local',
    AWS_ACM_ARN: '',
    AWS_ROUTE53_ZONE_ID: '',

    // lambda
    JWT_SECRET: '',
    DDB_TABLE_DATAS: '',
  },
  dev: {
    // dev
    APP_PORT: '8123',
    
    // cdk
    STAGE: 'dev',
    AWS_ACM_ARN: '',
    AWS_ROUTE53_ZONE_ID: '',

    // lambda
    JWT_SECRET: '',
    DDB_TABLE_DATAS: '',
  },
  prod: {
    // dev
    APP_PORT: '8123',
    
    // cdk
    STAGE: 'prod',
    AWS_ACM_ARN: '',
    AWS_ROUTE53_ZONE_ID: '',

    // lambda
    JWT_SECRET: '',
    DDB_TABLE_DATAS: '',
  },
}
