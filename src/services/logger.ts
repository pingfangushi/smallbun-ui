import request from '@/utils/request';

/**
 * 分页查询登录日志
 * @param params
 */
export async function getLoginPage(params: {}) {
  return request('/api/logger/login', {
    params,
  });
}
/**
 * 分页查询操作日志
 * @param params
 */
export async function getOperatePage(params: {}) {
  return request('/api/logger/operate', {
    params,
  });
}

/**
 * 根据ID获取操作日志数据
 * @param id
 */
export async function getOperateById(id: string) {
  return request(`/api/logger/operate/${id}`);
}
/**
 * 清空登录日志
 */
export async function emptyLogin() {
  return request('/api/logger/login', {
    method: 'DELETE',
  });
}
/**
 * 清空操作日志
 */
export async function emptyOperate() {
  return request('/api/logger/operate', {
    method: 'DELETE',
  });
}
