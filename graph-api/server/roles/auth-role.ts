import { GraphQLEnumType } from 'graphql'

export enum AuthRole {
  APP_USER = 'app::user', // 일반사용자

  ADMIN_MANAGER = 'admin::manager', // 관리자 일반
  ADMIN_DEVELOPER = 'admin::developer', // 개발자 (전체권한)
}

export const GraphQLAuthRole = new GraphQLEnumType({
  name: 'AuthRole',
  values: {
    APP_USER: { value: 'app::user', description: '일반사용자' },

    ADMIN_MANAGER: { value: 'admin::manager', description: '관리자 일반' },
    ADMIN_DEVELOPER: { value: 'admin::developer', description: '개발자 (전체권한)' },
  },
})
