import request from '@/utils/request';

/**
 * 唯一验证
 * @param params
 */
export async function unique(params: {}) {
  return request('/upms/api/group/unique', {
    params,
  });
}

/**
 * 查询树
 * @param params
 */
export async function getTree(params: {}) {
  return request('/upms/api/group/tree', {
    params,
  });
}

/**
 * 查询列表
 * @param params
 */
export async function getList(params: {}) {
  return request('/upms/api/group', {
    params,
  });
}

/**
 * 根据ID获取数据
 * @param id
 */
export async function getById(id: string) {
  return request(`/upms/api/group/${id}`);
}

/**
 * 新增
 * @param params
 */
export async function add(params: {}) {
  return request('/upms/api/group', {
    method: 'POST',
    data: params,
  });
}

/**
 * 修改
 * @param params
 */
export async function updateById(params: {}) {
  return request('/upms/api/group', {
    method: 'PUT',
    data: params,
  });
}

/**
 * 删除
 * @param params
 */
export async function removeByIds(params: { ids: [] }) {
  return request(`/upms/api/group/${new Array(params.ids).join(',')}`, {
    method: 'DELETE',
    data: params,
  });
}
/**
 * 根据ID更新状态
 * @param params
 */
export async function updateStatusById(params: { id: string; status: string }) {
  return request(`/upms/api/group/${params.id}/status/${params.status}`, {
    method: 'PUT',
  });
}
