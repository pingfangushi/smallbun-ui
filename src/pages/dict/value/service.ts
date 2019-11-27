import request from '../../../utils/request';

/**
 * 查询数据
 * @param params
 */
export async function fetch(params: {}) {
  return request('/api/dict/value', {
    params,
  });
}

/**
 * 唯一验证
 * @param params
 */
export async function unique(params: {}) {
  return request('/api/dict/value/unique', {
    params,
  });
}

/**
 * 根据ID查询数据
 * @param params
 */
export async function getById(params: { id: string }) {
  return request(`/api/dict/value/${params.id}`);
}

/**
 * 新增
 * @param params
 */
export async function add(params: {}) {
  return request('/api/dict/value', {
    method: 'POST',
    data: params,
  });
}

/**
 * 修改
 * @param params
 */
export async function updateById(params: {}) {
  return request('/api/dict/value', {
    method: 'PUT',
    data: params,
  });
}

/**
 * 根据ID修改是否是默认值
 * @param params
 */
export async function updateIsDefaultById(params: { id: string; isDefault: string }) {
  return request(`/api/dict/value/${params.id}/default/${params.isDefault}`, {
    method: 'PUT',
  });
}

/**
 * 删除
 * @param params
 */
export async function removeByIds(params: { ids: [] }) {
  return request(`/api/dict/value/${new Array(params.ids).join(',')}`, {
    method: 'DELETE',
  });
}
