/**
 * 状态枚举
 */
export enum UserStatus {
  // 正常
  ENABLE = 'ENABLE',
  // 禁用
  DISABLE = 'DISABLE',
  // 冻结
  LOCKED = 'LOCKED',
}
/**
 * 用户登录状态
 */
export enum UserLoginStatus {
  // 账户或密码错误
  EX000101 = '000101',
  // 验证码错误
  EX000102 = '000102',
  // 数字签名错误
  EX900005 = '900005',
  // 用户被禁用
  EX000104 = '000104',
  // 用户被锁定
  EX000103 = '000103',
  // 用户没有可用权限
  EX000105 = '000105',
  // 用户不存在
  EX000107 = '000107',
  // success
  SUCCESS = '200',
}
