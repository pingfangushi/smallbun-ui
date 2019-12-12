import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/manage/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/manage/api/account');
}

export async function queryNotices(): Promise<any> {
  return request('/manage/api/notices');
}

/**
 * 唯一验证
 * @param params
 */
export async function unique(params: {}) {
  return request('/manage/api/user/unique', {
    params,
  });
}

/**
 * 分页查询
 * @param params
 */
export async function getPage(params: {}) {
  return request('/manage/api/user', {
    params,
  });
}

/**
 * 根据ID获取数据
 * @param id
 */
export async function getById(id: string) {
  return request(`/manage/api/user/${id}`);
}

/**
 * 新增
 * @param params
 */
export async function add(params: {}) {
  return request('/manage/api/user', {
    method: 'POST',
    data: params,
  });
}

/**
 * 修改
 * @param params
 */
export async function updateById(params: {}) {
  return request('/manage/api/user', {
    method: 'PUT',
    data: params,
  });
}
/**
 * 修改
 * @param params
 */
export async function updatePassword(params: {}) {
  return request('/manage/api/user/password', {
    method: 'PUT',
    data: params,
  });
}
/**
 * 删除
 * @param params
 */
export async function removeByIds(params: { ids: [] }) {
  return request(`/manage/api/user/${new Array(params.ids).join(',').toString()}`, {
    method: 'DELETE',
  });
}
/**
 * 根据ID更新状态
 * @param params
 */
export async function updateStatusById(params: { id: string; status: string }) {
  return request(`/manage/api/user/${params.id}/status/${params.status}`, {
    method: 'PUT',
  });
}
