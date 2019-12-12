import request from '@/utils/request';

export interface LoginParamsType {
  userName: string;
  password: string;
  captcha: string;
}

/**
 * 账户登录
 * @param params
 */
export async function accountLogin(params: LoginParamsType) {
  return request('/upms/api/account/login', {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取图片验证码
 */
export async function getImageCaptcha(params: {}) {
  return request('/upms/api/image_captcha', {
    params,
  });
}

/**
 * 获取公钥
 */
export async function getPublicSecret() {
  return request('/upms/api/public_secret');
}
