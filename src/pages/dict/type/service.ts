import request from '../../../utils/request';

/**
 * 分页查询
 * @param params
 */
export async function fetch(params: {}) {
  return request('/api/dict/type', {
    params,
  });
}

/**
 * 分页查询
 * @param params
 */
export async function unique(params: {}) {
  return request('/api/dict/type/unique', {
    params,
  });
}

/**
 * 根据ID查询数据
 * @param params
 */
export async function getById(params: { id: string }) {
  return request(`/api/dict/type/${params.id}`);
}

/**
 * 添加数据
 * @param params
 */
export async function add(params: {}) {
  return request('/api/dict/type', {
    method: 'POST',
    data: params,
  });
}

/**
 * 修改数据
 * @param params
 */
export async function updateById(params: {}) {
  return request('/api/dict/type', {
    method: 'PUT',
    data: params,
  });
}

/**
 * 删除数据
 * @param params
 */
export async function removeByIds(params: { ids: [] }) {
  return request(`/api/dict/type/${new Array(params.ids).join(',')}`, {
    method: 'DELETE',
  });
}

/**
 * 根据ID更新状态
 * @param params
 */
export async function updateStatusById(params: { id: string; status: string }) {
  return request(`/api/dict/type/${params.id}/status/${params.status}`, {
    method: 'PUT',
  });
}
