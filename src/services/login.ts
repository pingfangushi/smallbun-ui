import request from '@/utils/request';

export interface LoginParamsType {
  userName: string;
  password: string;
  captcha: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取图片验证码
 */
export async function getImageCaptcha(params: {}) {
  return request('/api/image_captcha', {
    params,
  });
}

/**
 * 获取公钥
 */
export async function getPublicSecret() {
  return request('/api/public_secret');
}
