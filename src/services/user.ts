import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/upms/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/upms/api/account');
}

export async function queryNotices(): Promise<any> {
  return request('/upms/api/notices');
}

/**
 * 唯一验证
 * @param params
 */
export async function unique(params: {}) {
  return request('/upms/api/user/unique', {
    params,
  });
}

/**
 * 分页查询
 * @param params
 */
export async function getPage(params: {}) {
  return request('/upms/api/user', {
    params,
  });
}

/**
 * 根据ID获取数据
 * @param id
 */
export async function getById(id: string) {
  return request(`/upms/api/user/${id}`);
}

/**
 * 新增
 * @param params
 */
export async function add(params: {}) {
  return request('/upms/api/user', {
    method: 'POST',
    data: params,
  });
}

/**
 * 修改
 * @param params
 */
export async function updateById(params: {}) {
  return request('/upms/api/user', {
    method: 'PUT',
    data: params,
  });
}
/**
 * 修改
 * @param params
 */
export async function updatePassword(params: {}) {
  return request('/upms/api/user/password', {
    method: 'PUT',
    data: params,
  });
}
/**
 * 删除
 * @param params
 */
export async function removeByIds(params: { ids: [] }) {
  return request(`/upms/api/user/${new Array(params.ids).join(',').toString()}`, {
    method: 'DELETE',
  });
}
/**
 * 根据ID更新状态
 * @param params
 */
export async function updateStatusById(params: { id: string; status: string }) {
  return request(`/upms/api/user/${params.id}/status/${params.status}`, {
    method: 'PUT',
  });
}
