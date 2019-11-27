import request from '@/utils/request';
import { SearchParams } from './data.d';

/**
 * 角色唯一验证
 * @param params
 */
export async function unique(params: {}) {
  return request('/api/role/unique', {
    params,
  });
}

/**
 * 分页查询角色
 * @param params
 */
export async function getPage(params: SearchParams) {
  return request('/api/role', {
    params,
  });
}
/**
 * getRoleAuth
 * @param id
 */
export async function getRoleAuth(id: string) {
  return request(`/api/role/auth/${id}`);
}
/**
 * 根据ID获取角色
 * @param id
 */
export async function getById(id: string) {
  return request(`/api/role/${id}`);
}

/**
 * 新增角色
 * @param params
 */
export async function add(params: {}) {
  return request('/api/role', {
    method: 'POST',
    data: params,
  });
}

/**
 * 修改角色
 * @param params
 */
export async function update(params: {}) {
  return request('/api/role', {
    method: 'PUT',
    data: params,
  });
}
/**
 * updateAuthorize
 * @param params
 */
export async function updateAuthorize(params: {
  id: string;
  type: string;
  auth: string;
  checked: boolean;
}) {
  return request('/api/role/update/authorize', {
    method: 'PUT',
    data: params,
  });
}
/**
 * 删除角色
 * @param params
 */
export async function removeByIds(params: { ids: [] }) {
  return request(`/api/role/${new Array(params.ids).join(',').toString()}`, {
    method: 'DELETE',
  });
}
/**
 * 根据ID更新状态
 * @param params
 */
export async function updateStatusById(params: { id: string; status: string }) {
  return request(`/api/role/${params.id}/status/${params.status}`, {
    method: 'PUT',
  });
}
